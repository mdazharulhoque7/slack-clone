import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

const populteThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_id", (q) => q.eq("parentId", messageId))
    .collect();
  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);
  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }
  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);
  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
  };
};

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    let _conversation_id = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentId) {
      const parentMessage = await ctx.db.get(args.parentId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }
      _conversation_id = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentId", args.parentId)
          .eq("conversationId", _conversation_id)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;
            if (!member || !user) {
              return null;
            }
            const reactions = await populateReactions(ctx, message._id);
            const thread = await populteThread(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            /**
             * Normalize the reaction data
             *
             */

            // Count similar reactions
            const reactionsWithCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              };
            });

            // Elemenate Duplicate reaction count
            const uniqueReactionCount = reactionsWithCounts.reduce(
              (accumulator, reaction) => {
                const existingReaction = accumulator.find(
                  (r) => r.value === reaction.value
                );
                if (existingReaction) {
                  existingReaction.memberIds = Array.from(
                    new Set([...existingReaction.memberIds, reaction.memberId])
                  );
                } else {
                  accumulator.push({
                    ...reaction,
                    memberIds: [reaction.memberId],
                  });
                }
                return accumulator;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            );

            const reactionsWithoutMemberIdProp = uniqueReactionCount.map(
              ({ memberId, ...rest }) => rest
            );

            return {
              ...message,
              image,
              member,
              user,
              reactions: reactionsWithoutMemberIdProp,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestamp: thread.timestamp,
            };
          })
        )
      ).filter((message) => message !== null),
    };
  },
});

export const getById = query({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    // Checked whether use loged in
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Quering the message with id in param
    const message = await ctx.db.get(args.id);
    if (!message) return null;

      //   Check whether the loged in user is a member of workspace, if not the user will not be able to view message
      const isWorkspaceMember = await getMember(ctx, message.workspaceId, userId);
      if (!isWorkspaceMember) return null;
      
    // Getting sender/member information of the message
    const member = await populateMember(ctx, message.memberId);
    if (!member) return null;

    // Getting user info of the sender/memeber of the message
    const user = await populateUser(ctx, member.userId);
    if (!user) return null;

    // Getting reactions to the message
    const reactions = await populateReactions(ctx, message._id);

    // Count similar reactions
    const reactionsWithCounts = reactions.map((reaction) => {
      return {
        ...reaction,
        count: reactions.filter((r) => r.value === reaction.value).length,
      };
    });

    // Elemenate Duplicate reaction count
    const uniqueReactionCount = reactionsWithCounts.reduce(
      (accumulator, reaction) => {
        const existingReaction = accumulator.find(
          (r) => r.value === reaction.value
        );
        if (existingReaction) {
          existingReaction.memberIds = Array.from(
            new Set([...existingReaction.memberIds, reaction.memberId])
          );
        } else {
          accumulator.push({
            ...reaction,
            memberIds: [reaction.memberId],
          });
        }
        return accumulator;
      },
      [] as (Doc<"reactions"> & {
        count: number;
        memberIds: Id<"members">[];
      })[]
      );
      
    //   Reactions without member id
      const reactionsWithoutMemberIdProp = uniqueReactionCount.map(
        ({ memberId, ...rest }) => rest
      );

      // Build image link if the message has image content
      const image = message.image
      ? await ctx.storage.getUrl(message.image)
      : undefined;

      return {
          ...message,
          image,
          user,
          member,
          reactions: reactionsWithoutMemberIdProp
      }
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member) {
      throw new Error("Unauthorized");
    }

    let _conversation_id = args.conversationId;
    // Only Possible if we are replaying in a thread in 1:1 conversation.
    if (!args.conversationId && !args.channelId && args.parentId) {
      const parentMessage = await ctx.db.get(args.parentId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }
      _conversation_id = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      conversationId: _conversation_id,
      parentId: args.parentId,
    });
    return messageId;
  },
});

export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});
export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

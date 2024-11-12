import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">
) => {

    return ctx.db.query("members")
        .withIndex("by_workspace_id_user_id",
            (q) =>
                q.eq("workspaceId", workspaceId)
                    .eq("userId", userId)
        ).unique();
}


export const toggle = mutation({
    args:{
        messageId: v.id("messages"),
        value: v.string()
    },
    handler: async (ctx, args)=>{
        const userId = await getAuthUserId(ctx)
        if(!userId){
            return new Error("Unauthorized")
        }

        const message = await ctx.db.get(args.messageId);
        if(!message){
            return new Error("Message not found");
        }

        const member = await getMember(ctx, message.workspaceId, userId)
        if(!member){
            return new Error("Unauthorized");
        }

        const existingReaction = await ctx.db.query("reactions")
                                            .filter((q)=>
                                                q.and(
                                                    q.eq(q.field("messageId"), message._id),
                                                    q.eq(q.field("memberId"), member._id),
                                                    q.eq(q.field("value"), args.value)
                                                )
                                            ).first();

        if(existingReaction){
            await ctx.db.delete(existingReaction._id)
            return existingReaction._id
        }else{
            const reactionId = await ctx.db.insert("reactions",{
                workspaceId: message.workspaceId,
                messageId: message._id,
                memberId: member._id,
                value:args.value
            })
            return reactionId;
        }

    }
})
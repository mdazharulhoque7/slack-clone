
import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const create = mutation({
    args: {
        name: v.string(),
        workspaceId: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        // Check whether the user is authenticated
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized!");
        }

        // Check whether the user is a member of the workspace and has admin permission
        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", args.workspaceId)
                    .eq("userId", userId)
            ).unique()
        if (!member || member.role !== 'admin') {
            throw new Error("Unauthorized!");
        }

        // Insert channel data into the database
        // ****************************************

        // replace any whitespaces within the name submitted by '-'
        const populatedName = args.name.replace(/\s+/g, "-").toLowerCase();

        const channelId = await ctx.db.insert("channels",{
            name: populatedName,
            workspaceId: args.workspaceId
        })
        return channelId;
    }

})

export const get = query({
    args: {
        workspaceId: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        // Check wheter current user is a member of asking workspace
        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", args.workspaceId).eq("userId", userId)
            ).unique()

        if (!member) {
            return [];
        }
        const channels = await ctx.db.query("channels")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
            .collect()
        return channels
    }
});
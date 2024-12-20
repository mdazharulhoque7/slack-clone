import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const generateCode = ()=>{
  
  const code =Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("")
  return code;
} 

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized!");
    }

    // TODO: Actual method wil be implemented later
    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin"
    })

    // Creating default channel for the workspace
    await ctx.db.insert("channels", {
      name: "general",
      workspaceId
    })
    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const members = ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    // Extract the list of workspaceId in an array so that we can furthur filter workspace query
    const workspaceIds = (await members).map((member) => member.workspaceId);

    const resultWorkspace = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        resultWorkspace.push(workspace);
      }
    }

    return resultWorkspace
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null
    }
    const isMemberOfWorkspace = await ctx.db.query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique()
    if (!isMemberOfWorkspace) {
      return null;
    }
    return await ctx.db.get(args.id);
  },
});


export const getPublicInfoById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null
    }
    const isMemberOfWorkspace = await ctx.db.query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique();

    const workspace = await ctx.db.get(args.id);

    return {
      name: workspace?.name,
      isMember: !!isMemberOfWorkspace
    }
  },
});

export const currentUserAsWorkspaceMember = query({
  args: {workspaceId: v.id("workspaces")},
  handler: async (ctx, args)=>{
    const userId = await getAuthUserId(ctx);
    if(!userId){
      return null;
    }
    const member = await ctx.db
                      .query("members")
                      .withIndex("by_workspace_id_user_id", (q)=> 
                        q.eq("workspaceId", args.workspaceId)
                        .eq("userId", userId)
                      )
                      .unique()
    if(!member){
      return null;
    }
    return member;
  }
});
export const workspaceMembers = query({
  args: {workspaceId: v.id("workspaces")},
  handler: async (ctx, args)=>{
    const userId = await getAuthUserId(ctx);
    if(!userId){
      return null;
    }
    const members = await ctx.db
                      .query("members")
                      .withIndex("by_workspace_id_user_id", (q)=> 
                        q.eq("workspaceId", args.workspaceId)
                        .eq("userId", userId)
                      )
                      .collect()
    if(!members){
      return null;
    }
    return members;
  }
})

export const update = mutation({
  args:{
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async(ctx, args)=>{
    const userId = await getAuthUserId(ctx);
    if(!userId){
      throw Error("Unauthorized!")
    }
    const currentMember = await ctx.db.query("members")
                              .withIndex("by_workspace_id_user_id", 
                                (q)=> q.eq("workspaceId", args.id).eq("userId", userId)
                              )
                              .unique();
    if(!currentMember || currentMember.role !== "admin"){
      throw Error("Unauthorized!")
    }
   await ctx.db.patch(args.id, {
    name: args.name
   }); 
   return args.id;
  }
});


export const remove = mutation({
  args:{
    id: v.id("workspaces")
  },
  handler: async(ctx, args)=>{
    const userId = await getAuthUserId(ctx);
    if(!userId){
      throw Error("Unauthorized!")
    }
    const currentMember = await ctx.db.query("members")
                              .withIndex("by_workspace_id_user_id", 
                                (q)=> q.eq("workspaceId", args.id).eq("userId", userId)
                              )
                              .unique();
    if(!currentMember || currentMember.role !== "admin"){
      throw Error("Unauthorized!")
    }
    const [members] = await Promise.all([
      ctx.db.query("members")
            .withIndex("by_workspace_id", (q)=>q.eq("workspaceId", args.id))
            .collect()
    ])
   for(const member of members){
      await ctx.db.delete(member._id)
   }
   await ctx.db.delete(args.id); 
   return args.id;
  }
});


export const updateJoinCode = mutation({
  args:{
    id: v.id("workspaces")
  },
  handler: async(ctx, args)=>{
    const userId = await getAuthUserId(ctx);
    if(!userId){
      throw new Error("Unauthorized!")
    }
    const currentMember = await ctx.db.query("members")
                              .withIndex("by_workspace_id_user_id", 
                                (q)=> q.eq("workspaceId", args.id).eq("userId", userId)
                              )
                              .unique();
    if(!currentMember || currentMember.role !== "admin"){
      throw Error("Unauthorized!")
    }
   const joinCode = generateCode()
   await ctx.db.patch(args.id, {
    joinCode
   }); 
   return args.id;
  }
});

export const joinWorkspaceMember = mutation({
  args:{
    joinCode: v.string(),
    workspaceId: v.id("workspaces")
  },
  handler: async(ctx, args)=>{
    const userId = await getAuthUserId(ctx);
    console.log("userId: ", userId)
    if(!userId){
      throw new Error("Unauthorized!")
    }

    const workspace = await ctx.db.get(args.workspaceId)
    if(!workspace){
      throw new Error("Workspace not found!");
    }


    if(workspace.joinCode !== args.joinCode.toLowerCase()){
     throw new Error("Invalid join code");
    }

    const existingMember = await ctx.db.query("members")
    .withIndex("by_workspace_id_user_id", 
      (q)=> q.eq("workspaceId", args.workspaceId).eq("userId", userId)
    )
    .unique();

    if(existingMember){
      throw new Error("Aleary a member of this workspace");
    }

    const memberId = await ctx.db.insert("members",{
      userId,
      workspaceId: workspace._id,
      role: "member"
    })
    
    return workspace._id;

  }
})
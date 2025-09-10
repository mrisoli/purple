import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return [];
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.unique();

		if (!user) {
			return [];
		}

		return await ctx.db
			.query("projects")
			.withIndex("by_owner", (q) => q.eq("ownerId", user._id))
			.collect();
	},
});

export const get = query({
	args: {
		projectId: v.id("projects"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return null;
		}

		const project = await ctx.db.get(args.projectId);
		if (!project) {
			return null;
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.unique();

		if (!user) {
			return null;
		}

		// User can access project if they own it or are the buddy
		if (project.ownerId === user._id || project.buddyId === user._id) {
			return project;
		}

		return null;
	},
});

export const create = mutation({
	args: {
		name: v.string(),
		description: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.unique();

		if (!user) {
			throw new Error("User not found");
		}

		// Check project limit for free users
		if (!user.premium) {
			const existingProjects = await ctx.db
				.query("projects")
				.withIndex("by_owner", (q) => q.eq("ownerId", user._id))
				.collect();

			if (existingProjects.length >= 1) {
				throw new Error("Free users can only create 1 project. Upgrade to premium for unlimited projects.");
			}
		}

		const newProjectId = await ctx.db.insert("projects", {
			ownerId: user._id,
			name: args.name,
			description: args.description,
			createdAt: Date.now(),
		});

		return await ctx.db.get(newProjectId);
	},
});

export const inviteBuddy = mutation({
	args: {
		projectId: v.id("projects"),
		buddyEmail: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}

		const project = await ctx.db.get(args.projectId);
		if (!project) {
			throw new Error("Project not found");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.unique();

		if (!user || project.ownerId !== user._id) {
			throw new Error("Only project owner can invite buddies");
		}

		const buddy = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("email"), args.buddyEmail))
			.unique();

		if (!buddy) {
			throw new Error("User with this email not found. They need to sign up first.");
		}

		await ctx.db.patch(args.projectId, { buddyId: buddy._id });

		return { success: true };
	},
});
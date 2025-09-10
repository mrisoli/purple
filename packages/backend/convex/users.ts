import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return null;
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.unique();

		return user;
	},
});

export const getOrCreate = mutation({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}

		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
			.unique();

		if (existingUser) {
			return existingUser;
		}

		const newUserId = await ctx.db.insert("users", {
			clerkId: identity.subject,
			email: identity.email ?? "",
			name: identity.name ?? "",
			premium: false,
			createdAt: Date.now(),
		});

		return await ctx.db.get(newUserId);
	},
});

export const findByEmail = query({
	args: {
		email: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("email"), args.email))
			.unique();
	},
});

export const upgradeToPremium = mutation({
	args: {
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.userId, { premium: true });
		return { success: true };
	},
});
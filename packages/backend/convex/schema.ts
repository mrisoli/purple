import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		email: v.string(),
		name: v.string(),
		premium: v.boolean(),
		createdAt: v.number(),
	}).index("by_clerkId", ["clerkId"]),

	projects: defineTable({
		ownerId: v.id("users"),
		name: v.string(),
		description: v.string(),
		buddyId: v.optional(v.id("users")),
		createdAt: v.number(),
	}).index("by_owner", ["ownerId"]),

	actions: defineTable({
		projectId: v.id("projects"),
		userId: v.id("users"),
		type: v.string(),
		message: v.string(),
		createdAt: v.number(),
	}).index("by_project", ["projectId"]),
});

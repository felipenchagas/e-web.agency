import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  matches: defineTable({
    homeTeam: v.string(),
    awayTeam: v.string(),
    league: v.string(),
    startTime: v.number(),
    status: v.optional(v.union(v.literal("scheduled"), v.literal("live"), v.literal("finished"))),
  }).index("by_status", ["status"]),
  
  bets: defineTable({
    matchId: v.id("matches"),
    userId: v.id("users"),
    picks: v.array(v.string()),
    size: v.optional(v.union(v.literal("small"), v.literal("medium"), v.literal("large"))),
    status: v.optional(v.union(
      v.literal("imaginary"),
      v.literal("ready"),
      v.literal("live"),
      v.literal("saved"),
      v.literal("finished")
    )),
    result: v.optional(v.union(v.literal("won"), v.literal("lost"), v.literal("void"))),
    createdAt: v.optional(v.number()),
    odds: v.optional(v.number()),
    isAdmin: v.optional(v.boolean())
  })
  .index("by_user_and_match", ["userId", "matchId"])
  .index("by_user", ["userId"])
  .index("by_status", ["status"])
  .index("by_admin", ["isAdmin"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});

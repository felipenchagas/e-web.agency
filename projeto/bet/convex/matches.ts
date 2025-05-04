import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("matches").collect();
  },
});

export const getImaginaryBets = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("bets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "imaginary"))
      .collect();
  },
});

export const getReadyBets = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("bets")
      .filter((q) => q.eq(q.field("status"), "ready"))
      .collect();
  },
});

export const getLiveBets = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("bets")
      .filter((q) => q.eq(q.field("status"), "live"))
      .collect();
  },
});

export const getSavedBets = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("bets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "saved"))
      .collect();
  },
});

export const generateImaginaryBet = mutation({
  args: {
    matchId: v.id("matches"),
    size: v.union(v.literal("small"), v.literal("medium"), v.literal("large")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const picks = [];
    const numPicks = args.size === "small" ? 3 : args.size === "medium" ? 5 : 10;
    
    const markets = [
      "Vitória Casa", "Vitória Fora", "Empate",
      "Mais de 2.5 gols", "Menos de 2.5 gols",
      "Ambas equipes marcam - Sim", "Ambas equipes marcam - Não",
      "Casa marca", "Fora marca",
      "Resultado exato 1-0", "Resultado exato 2-1", "Resultado exato 1-1"
    ];

    for (let i = 0; i < numPicks; i++) {
      const randomIndex = Math.floor(Math.random() * markets.length);
      picks.push(markets[randomIndex]);
    }

    await ctx.db.insert("bets", {
      matchId: args.matchId,
      userId,
      picks,
      size: args.size,
      createdAt: Date.now(),
      status: "imaginary",
    });
  },
});

export const saveBet = mutation({
  args: {
    betId: v.id("bets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const bet = await ctx.db.get(args.betId);
    if (!bet || bet.userId !== userId) {
      throw new Error("Bet not found or unauthorized");
    }

    await ctx.db.patch(args.betId, {
      status: "saved",
    });
  },
});

export const deleteBet = mutation({
  args: {
    betId: v.id("bets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const bet = await ctx.db.get(args.betId);
    if (!bet || bet.userId !== userId) {
      throw new Error("Bet not found or unauthorized");
    }

    await ctx.db.delete(args.betId);
  },
});

export const adminAddBet = mutation({
  args: {
    matchId: v.id("matches"),
    picks: v.array(v.string()),
    status: v.union(v.literal("ready"), v.literal("live")),
    odds: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user || user.name !== "e-web") {
      throw new Error("Unauthorized - Admin only");
    }

    await ctx.db.insert("bets", {
      matchId: args.matchId,
      userId,
      picks: args.picks,
      createdAt: Date.now(),
      status: args.status,
      odds: args.odds,
      isAdmin: true,
    });
  },
});

export const adminUpdateBet = mutation({
  args: {
    betId: v.id("bets"),
    picks: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("ready"), v.literal("live"), v.literal("finished"))),
    odds: v.optional(v.number()),
    result: v.optional(v.union(v.literal("won"), v.literal("lost"), v.literal("void"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user || user.name !== "e-web") {
      throw new Error("Unauthorized - Admin only");
    }

    const bet = await ctx.db.get(args.betId);
    if (!bet) throw new Error("Bet not found");

    const updates: any = {};
    if (args.picks) updates.picks = args.picks;
    if (args.status) updates.status = args.status;
    if (args.odds) updates.odds = args.odds;
    if (args.result) updates.result = args.result;

    await ctx.db.patch(args.betId, updates);
  },
});

export const clearBets = mutation({
  args: {
    matchId: v.id("matches"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const bets = await ctx.db
      .query("bets")
      .withIndex("by_user_and_match", (q) => 
        q.eq("userId", userId).eq("matchId", args.matchId)
      )
      .collect();

    for (const bet of bets) {
      await ctx.db.delete(bet._id);
    }
  },
});

export const migrateBets = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user || user.name !== "e-web") {
      throw new Error("Unauthorized - Admin only");
    }

    const bets = await ctx.db.query("bets").collect();
    
    for (const bet of bets) {
      await ctx.db.patch(bet._id, {
        status: bet.status ?? "imaginary",
        createdAt: bet.createdAt ?? Date.now(),
        isAdmin: bet.isAdmin ?? false
      });
    }
  },
});

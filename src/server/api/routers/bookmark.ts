import { z } from "zod";
import type { Bookmark } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bookmarkRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.bookmark.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // procedure for n random bookmarks
  getNRandom: publicProcedure
    .input(z.object({ count: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.db.$queryRaw<
        Bookmark[]
      >`SELECT * FROM "Bookmark" ORDER BY random() LIMIT ${input.count}`;
    }),

  // procedure for searching bookmarks
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.bookmark.findMany({
        where: {
          OR: [
            { title: { contains: input.query, mode: "insensitive" } },
            { tags: { contains: input.query, mode: "insensitive" } },
            { categories: { contains: input.query, mode: "insensitive" } },
            { url: { contains: input.query, mode: "insensitive" } },
          ],
        },
      });
    }),
});

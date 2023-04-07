import { clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '~/server/api/trpc';

import type { User } from '@clerk/nextjs/dist/api'
import { TRPCError } from '@trpc/server';

function filterUserForClient({ id, username, profileImageUrl }: User) {
  return {
    id,
    username,
    profileImageUrl
  }
}

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const limit = 100
    const posts = await ctx.prisma.post.findMany({
      take: limit,
      orderBy: [{
        updatedAt: "desc"
      }]
    });

    const users = (await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit
    })).map(filterUserForClient)


    return posts.map((post) => {
      const author = users.find(user => user.id === post.authorId)
      if (!author || !author.username) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Author for post not found!" })

      return {
        post,
        author: {
          ...author,
          username: author.username
        }
      }
    });
  }),

  create: privateProcedure
    .input(z.object({
      content: z.string().min(1).max(255)
    })).mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content
        }
      })

      return post
    })
});

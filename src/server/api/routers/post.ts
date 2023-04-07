import { clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

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
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const limit = 100
    const posts = await ctx.prisma.post.findMany({
      take: limit,
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
});

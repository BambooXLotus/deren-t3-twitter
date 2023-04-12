import { clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '~/server/api/trpc';

import { TRPCError } from '@trpc/server';

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { filterUserForClient } from '~/utils/helpers';
import { type Post } from '@prisma/client';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  timeout: 1000, // 1 second
  analytics: true
});

const limit = 100

async function addUserDataToPosts(posts: Post[]) {
  const userIds = posts.map(post => post.authorId)

  const users = (await clerkClient.users.getUserList({
    userId: userIds,
    limit
  })).map(filterUserForClient)

  return posts.map((post) => {

    const author = users.find((user) => user.id === post.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }

    // if (!author.username) {
    //   // user the ExternalUsername
    //   if (!author.externalUsername) {
    //     throw new TRPCError({
    //       code: "INTERNAL_SERVER_ERROR",
    //       message: `Author has no GitHub Account: ${author.id}`,
    //     });
    //   }
    //   author.username = author.externalUsername;
    // }

    return {
      post,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
}

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: limit,
      orderBy: [{
        updatedAt: "desc"
      }]
    });

    return addUserDataToPosts(posts)
  }),

  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.prisma.post
        .findMany({
          where: {
            authorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        }).then(addUserDataToPosts)
    ),

  create: privateProcedure
    .input(z.object({
      content: z.string().min(1).max(255)
    })).mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" })

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content
        }
      })

      return post
    })
});

import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { filterUserForClient as transformUserForClient } from '~/utils/helpers';

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure.input(z.object({
    username: z.string()
  })).query(async ({ input }) => {
    const [user] = await clerkClient.users.getUserList({
      username: [input.username]
    })

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found"
      })
    }

    return transformUserForClient(user)
  }),
  getAll: publicProcedure
    .query(async () => {
      const users = await clerkClient.users.getUserList()

      return users.map(transformUserForClient)
    })

});

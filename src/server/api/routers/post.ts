import {z} from "zod";

import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  checkOnboard: protectedProcedure.mutation(async ({ctx}) => {
    if (!ctx.session.userId)
      return

    const found = await ctx.db.onboard.findMany({
      where: {userId: ctx.session.userId},
    })

    if (found.length === 0) {
      return ctx.db.onboard.create({
        data: {userId: ctx.session.userId, finished: false},
      })
    } else {
      return found
    }
  }),

  setOnboard: protectedProcedure
    .input(z.object({state: z.boolean()}))
    .mutation(({ctx, input}) => {

      if (!ctx.session.userId)
        return

      return ctx.db.onboard.updateMany({
        where: {userId: ctx.session.userId},
        data: {finished: input.state},
      })
    }),

  // create: protectedProcedure
  //   .input(z.object({name: z.string().min(1)}))
  //   .mutation(async ({ctx, input}) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //
  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //         createdBy: {connect: {id: ctx.session.user.id}},
  //       },
  //     });
  //   }),
  //
  // getLatest: protectedProcedure.query(({ctx}) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: {createdAt: "desc"},
  //     where: {createdBy: {id: ctx.session.user.id}},
  //   });
  // }),
  //
  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});

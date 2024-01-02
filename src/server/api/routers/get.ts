import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";

export const getRouter = createTRPCRouter({
  getOnboard: protectedProcedure.query(({ctx}) => {
    return ctx.db.onboard.findFirst({
      where: {userId: ctx.session.userId},
    });
  }),
});

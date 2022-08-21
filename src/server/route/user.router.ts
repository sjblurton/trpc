import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as trpc from '@trpc/server';
import { serialize } from 'cookie';
import { baseUrl } from 'globalConstants';
import { errorToString } from 'helper/errors';
import { createUserSchema, requestOtpSchema, verifyOtpSchema } from 'schema/user.schema';
import { createRouter } from 'server/createRouter';
import { decode, encode } from 'utils/base64';
import { signJwt } from 'utils/jwt';
import { sendLoginEmail } from 'utils/mailer';

export const userRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    async resolve({ ctx, input }) {
      const { email, name } = input;

      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });
        return user;
      } catch (error) {
        if (!(error instanceof PrismaClientKnownRequestError))
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: errorToString(error),
          });
        if (error.code === "P2002")
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "User already exist.",
          });

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    },
  })
  .mutation("request-otp", {
    input: requestOtpSchema,
    async resolve({ input, ctx }) {
      const { email, redirect } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const token = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      sendLoginEmail({
        email,
        token: encode(`${token.id}:${user.email}`),
        url: baseUrl,
      });

      return true;
    },
  })
  .query("verify-otp", {
    input: verifyOtpSchema,
    async resolve({ input, ctx }) {
      const decoded = decode(input.hash).split(":");
      const [id, email] = decoded;

      const token = await ctx.prisma.loginToken.findFirst({
        where: {
          id,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      });

      if (!token) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Invalid token",
        });
      }

      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });

      ctx.res.setHeader("Set-Cookie", serialize("token", jwt, { path: "/" }));

      return {
        redirect: token.redirect,
      };
    },
  });

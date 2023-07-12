import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { decode } from "base64-arraybuffer";
import isDataURI from "validator/lib/isDataURI";
import { createClient } from "@supabase/supabase-js";
import { env } from "../../../env/client.mjs";
import { TRPCError } from "@trpc/server";

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
);

export const userRouter = router({
  getUserProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          name: true,
          image: true,
          id: true,
          username: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
    }),

  getUserPosts: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          posts: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              createdAt: true,
              author: {
                select: {
                  name: true,
                  image: true,
                  username: true,
                },
              },
              bookmarks: session?.user?.id
                ? {
                    where: {
                      userId: session?.user?.id,
                    },
                  }
                : false,
            },
          },
        },
      });
    }),
  uploadAvatar: protectedProcedure
    .input(
      z.object({
        imageAsDataUrl: z.string().refine((val) => isDataURI(val)),
        username: z.string(),
        // mimetype: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const imageBase64Str = input.imageAsDataUrl.replace(/^.+,/, "");
      console.log(decode(imageBase64Str));

      const { data, error } = await supabase.storage
        .from("public")
        .upload(`avatars/${input.username}.png`, decode(imageBase64Str), {
          contentType: "image/png",
          upsert: true,
        });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "upload failed to spabase",
        });
      }
      const {
        data: { publicUrl },
      } = await supabase.storage.from("public").getPublicUrl(data?.path);

      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: publicUrl,
        },
      });
    }),
});

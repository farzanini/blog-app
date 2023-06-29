import slugify from "slugify";
import { writeFormSchema } from "../../../components/WriteFormModal";
import { publicProcedure, protectedProcedure, router } from "../trpc";

export const postRouter = router({
  createPost: protectedProcedure
    .input(writeFormSchema)
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { title, description, text },
      }) => {
        await prisma.post.create({
          data: {
            title,
            description,
            text,
            slug: slugify(title),
            author: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
      }
    ),
  getPosts: publicProcedure.query(async ({ ctx: { prisma } }) => {
    const posts = await prisma.post.findMany({
      orderBy:{
        createdAt: 'desc'
      },
      include:{
        author:{
          select:{
            name:true,
            image:true,
          }
        }
      }    
    });
    return posts;
  }),
});

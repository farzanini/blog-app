import { useRouter } from 'next/router'
import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { trpc } from '../utils/trpc'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const PostPage = () => {
    const router = useRouter()

    const getPost = trpc.post.getPost.useQuery(
      {
        slug: router.query.slug as string,
      },
      {
        enabled: Boolean(router.query.slug),
      }
    );
  return (
    <MainLayout>
      {getPost.isLoading && (
        <div className="flex h-full w-full items-center justify-center space-x-4">
          <div>
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
          <div>Loading...</div>
        </div>
      )}
      <div className="flex h-full w-full flex-col items-center justify-center p-10">
        <div className="flex w-full max-w-screen-lg flex-col space-y-6">
          <div className="relative h-[60vh] w-full rounded-xl bg-gray-300 shadow-lg">
            <div className="absolute flex h-full w-full items-center justify-center ">
              <div className="rounded-xl bg-black text-white text-3xl bg-opacity-50 p-4">
                {getPost.data?.title}
              </div>
            </div>
          </div>
          <div className="border-l-4 border-gray-800 pl-6">
            {getPost.data?.description}
          </div>
          <div>{getPost.data?.text}</div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PostPage
import React, { useState } from "react";
import { CiBookmarkCheck, CiBookmarkPlus } from "react-icons/ci";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import { RouterOutputs, trpc } from "../../utils/trpc";

type PostProps = RouterOutputs["post"]["getPosts"][number];

function Post({ ...post }: PostProps) {
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(post.bookmarks.length)
  );

  const bookmarkPost = trpc.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
    },
  });
  const removeBookmar = trpc.post.removeBookmark.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
    },
  });

  return (
    <div
      key={post.id}
      className="group flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
    >
      <div className="flex w-full items-center space-x-2">
        <div className="relative h-10 w-10 rounded-full bg-gray-400">
          {post.author.image && (
            <Image
              src={post.author.image}
              fill
              alt={post.author.name ?? ""}
              className="rounded-full"
            />
          )}
        </div>
        <div>
          <p className="font-semibold">
            {post.author.name} &#x2022;
            <span className="mx-1">
              {dayjs(post.createdAt).format("DD/MM/YYYY")}
            </span>
          </p>
          <p className="text-sm">Developer</p>
        </div>
      </div>
      <Link href={`/${post.slug}`} className="grid w-full grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col space-y-4">
          <p className="text-2xl font-bold text-gray-800 decoration-indigo-600 group-hover:underline ">
            {post.title}
          </p>
          <p className="break-words text-sm text-gray-500">
            {post.description}
          </p>
        </div>
        <div className="col-span-4">
          <div className="x-full h-full transform rounded-xl  bg-gray-500 transition duration-300 hover:scale-105 hover:shadow-xl"></div>
        </div>
        <div className="col-span-full "></div>
      </Link>
      <div>
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200/50 px-5 py-3">
                tag {i}
              </div>
            ))}
          </div>
          <div>
            {isBookmarked ? (
              <CiBookmarkCheck
                className="cursor-pointer text-3xl text-indigo-600"
                onClick={() => {
                  removeBookmar.mutate({
                    postId: post.id,
                  });
                }}
              />
            ) : (
              <CiBookmarkPlus
                className="cursor-pointer text-3xl"
                onClick={() => {
                  bookmarkPost.mutate({
                    postId: post.id,
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;

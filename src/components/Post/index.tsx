import React, { useState } from "react";
import { CiBookmarkCheck, CiBookmarkPlus } from "react-icons/ci";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

type PostProps = any;

const Post = ({
  author: { name, image, username },
  title,
  description,
  slug,
  featuredImage,
  createdAt,
  tags,
  id,
  bookmarks,
  likes,
}: PostProps) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarks?.length > 0);

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
    <div className=" flex  flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none">
      <Link
        href={`/user/${username}`}
        className="group flex w-full cursor-pointer items-center space-x-2 "
      >
        <div className="relative h-10 w-10 rounded-full bg-gray-400">
          {image && (
            <Image src={image} fill alt={name ?? ""} className="rounded-full" />
          )}
        </div>
        <div>
          <p className="font-semibold">
            <span className="decoration-indigo-600 group-hover:underline">
              {name}{" "}
            </span>{" "}
            &#x2022;
            <span className="mx-1">
              {dayjs(createdAt).format("DD/MM/YYYY")}
            </span>
          </p>
          <p className="text-sm">Developer</p>
        </div>
      </Link>
      <Link
        href={`/${slug}`}
        className="group grid h-44 w-full grid-cols-12 gap-4 overflow-hidden "
      >
        <div className="col-span-8 flex h-full flex-col space-y-4">
          <p className="text-2xl font-bold text-gray-800 decoration-indigo-600 group-hover:underline ">
            {title}
          </p>
          <p className="h-full truncate break-words text-sm text-gray-500">
            {description}
          </p>
        </div>
        <div className="col-span-4">
          <div className="h-full w-full transform rounded-xl  bg-gray-500 transition duration-300 hover:scale-105 hover:shadow-xl">
            {featuredImage && (
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="rounded-xl"
              />
            )}
          </div>
        </div>
      </Link>
      <div>
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            {tags.map((tag: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
              <div
                key={tag.id}
                className="rounded-2xl bg-gray-200/50 px-5 py-3"
              >
                {tag.name}
              </div>
            ))}
          </div>
          <div>
            {isBookmarked ? (
              <CiBookmarkCheck
                className="cursor-pointer text-3xl text-indigo-600"
                onClick={() => {
                  removeBookmar.mutate({
                    postId: id,
                  });
                }}
              />
            ) : (
              <CiBookmarkPlus
                className="cursor-pointer text-3xl"
                onClick={() => {
                  bookmarkPost.mutate({
                    postId: id,
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

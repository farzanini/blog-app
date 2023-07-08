import React from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { trpc } from "../../utils/trpc";
import dayjs from "dayjs";
import Link from "next/link";

const MainSection = () => {
  const getPosts = trpc.post.getPosts.useQuery();

  return (
    <main className="col-span-8 h-full w-full border-r border-gray-300 px-24">
      <div className="flex w-full flex-col space-y-4 py-10 ">
        <div className="flex w-full items-center space-x-4">
          <label
            htmlFor="search"
            className="relative w-full rounded-3xl border border-gray-800"
          >
            <div className="absolute left-2 flex h-full w-full w-max items-center">
              <CiSearch />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="w-full rounded-3xl px-4 py-1   pl-7 text-sm outline-none placeholder:text-xs placeholder:text-gray-300"
              placeholder="Search..."
            />
          </label>

          <div className="flex w-full items-center justify-end space-x-4">
            <div>My Topics:</div>
            <div className="flex items-center space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-gray-200/50 p-4">
                  tag {i}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between border-b border-gray-300 pb-8">
          <div>Articles</div>
          <div>
            <button className="flex items-center space-x-2 rounded-3xl border border-gray-800 px-4 py-1.5 font-semibold">
              <div>Following</div>
              <div>
                <HiChevronDown className="text-xl" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex  w-full flex-col justify-center space-y-8">
        {getPosts.isLoading && (
          <div className="flex h-full w-full items-center justify-center space-x-4">
            <div>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
            <div>Loading...</div>
          </div>
        )}
        {getPosts.isSuccess &&
          getPosts.data.map((post) => (
            <Link
              href={`/${post.slug}`}
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
              <div className="grid w-full grid-cols-12 gap-4">
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
              </div>
              <div>
                <div className="flex w-full items-center justify-start space-x-4">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-gray-200/50 px-5 py-3"
                      >
                        tag {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </main>
  );
};

export default MainSection;

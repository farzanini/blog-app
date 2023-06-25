import React from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from 'react-icons/hi'
const HomePage = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex h-20 w-full flex-row items-center justify-around border-b-[1px] border-gray-300 bg-white">
        <div>
          <IoReorderThreeOutline className="text-2xl text-gray-600" />
        </div>
        <div className="text-xl font-thin">Ultimate Blog App</div>
        <div className="flex items-center space-x-4">
          <div>
            <BsBell className="text-2xl text-gray-600" />
          </div>
          <div>
            <div className="h-5 w-5 rounded-full bg-gray-600" />
          </div>
          <div>
            <button className="flex items-center space-x-3 rounded border border-gray-200 px-4  py-2.5 transition hover:border-gray-900 hover:text-gray-900">
              <div>Write</div>
              <div>
                <FiEdit />
              </div>
            </button>
          </div>
        </div>
      </header>
      <section className="grid h-full w-full grid-cols-12 place-items-center">
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
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="group flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
              >
                <div className="flex w-full items-center space-x-2">
                  <div className="h-4 w-5 rounded-full bg-gray-400"></div>
                  <div>
                    <p className="font-semibold">
                      Farzan Hosseini &#x2022; 22 Dec. 2022
                    </p>
                    <p className="text-sm">Developer</p>
                  </div>
                </div>
                <div className="grid w-full grid-cols-12 gap-4">
                  <div className="col-span-8 flex flex-col space-y-4">
                    <p className="text-2xl font-bold text-gray-800 decoration-indigo-600 group-hover:underline ">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolores, odio!
                    </p>
                    <p className="text-sm text-gray-500 break-words">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Nobis rerum earum nisi corporis qui cum quis eveniet
                      dolores facilis obcaecati! Dolorum velit, error neque,
                      minus corporis sit laborum molestias laudantium veniam in
                      voluptatum, eum veritatis deleniti tenetur accusantium
                      eius repudiandae. Soluta maxime hic odit exercitationem
                      enim possimus perferendis a et adipisci ipsam perspiciatis
                      quasi nesciunt odio quos, reprehenderit voluptatem ullam?
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
              </div>
            ))}
          </div>
        </main>
        <aside className="col-span-4 h-full w-full"></aside>
      </section>
    </div>
  );
};

export default HomePage;

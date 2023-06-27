import React, { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import Modal from "../components/Modal";
import { GlobalContext } from "../contexts/GlobalContextProvider";

const HomePage = () => {
  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);

  return (
    <MainLayout>
      <section className="grid  grid-cols-12 ">
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
                  <div className="h-10 w-10 rounded-full bg-gray-400"></div>
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
                    <p className="break-words text-sm text-gray-500">
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
        <aside className="col-span-4  w-full space-y-4 p-6">
          <div>
            <h3 className="my-6 text-lg font-semibold">
              Pepople you might be interessted
            </h3>
            <div className="flex flex-col space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-row items-center space-x-5">
                  <div className="h-10 w-10 flex-none rounded-full bg-gray-300"></div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      John Doe
                    </div>
                    <div className="text-xs">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Eius nostrum recusandae tenetur perferendis?
                    </div>
                  </div>
                  <div>
                    <button className="flex items-center space-x-3 rounded border border-gray-400 px-4  py-2.5 transition hover:border-gray-900 hover:text-gray-900">
                      Follow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sticky top-20 ">
            <h3 className="my-6 text-lg font-semibold">Your reading list</h3>
            <div className="flex flex-col space-y-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group flex items-center space-x-6">
                  <div className="aspect-square h-full w-2/5 rounded-xl bg-gray-300"></div>
                  <div className="flex w-3/5 flex-col space-y-2">
                    <div className="text-lg font-semibold decoration-indigo-600 group-hover:underline">
                      Lorem ipsum dolor sit amet consectetur.
                    </div>
                    <div>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Delectus alias voluptatibus nulla possimus quod?
                    </div>
                    <div className="flex w-full items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                      <div> Farzan Hosseini &#x2022; </div>
                      <div>22 Dec. 2022</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          here is our form!
        </form>
      </Modal>
    </MainLayout>
  );
};

export default HomePage;

import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { BiEdit } from "react-icons/bi";
import { SlShareAlt } from "react-icons/sl";
import toast from "react-hot-toast";
import Post from "../../components/Post";
import { useSession } from "next-auth/react";

import { createClient } from "@supabase/supabase-js";
import { env } from "../../env/client.mjs";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
);

function UserProfilePage() {
  const router = useRouter();

  const currentUser = useSession();

  const userProfile = trpc.user.getUserProfile.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );
  const userPosts = trpc.user.getUserPosts.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  );

  const [file, setFile] = useState<File | null>(null);
  const [objectImage, setObjectImage] = useState("");

  const userRoute = trpc.useContext().user;

  const uploadAvatar = trpc.user.uploadAvatar.useMutation({
    onSuccess: () => {
      if (userProfile.data?.username) {
        userRoute.getUserProfile.invalidate({
          username: router.query.username as string,
        });
        toast.success("avatar updated !");
      }
    },
  });

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && userProfile.data?.username) {
      const file = e.target.files[0];

      if (file.size > 1.5 * 1000000) {
        return toast.error("image size should not be greater than 1MB");
      }

      setObjectImage(URL.createObjectURL(file));

      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onloadend = () => {
        if (fileReader.result && userProfile.data?.username) {
          uploadAvatar.mutate({
            imageAsDataUrl: fileReader.result as string,
            username: userProfile.data?.username,
            // mimetype: file.type,
          });
        }
      };
    }
  };
  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="my-10 h-full w-full flex-col items-center justify-center lg:max-w-screen-md xl:max-w-screen-lg">
          <div className="flex w-full flex-col rounded-3xl bg-white shadow-md">
            <div className="relative h-44 w-full rounded-t-3xl bg-gradient-to-br from-indigo-200 via-red-200 to-yellow-100">
              <div className="absolute -bottom-10 left-12">
                <div className="group relative h-28 w-28 cursor-pointer rounded-full border-2 border-white bg-gray-100">
                  {currentUser.data?.user?.id === userProfile.data?.id && (
                    <label
                      htmlFor="avatarFile"
                      className={
                        "absolute flex h-full w-full items-center justify-center rounded-full  group-hover:bg-black/20"
                      }
                    >
                      <BiEdit className="hidden text-3xl text-white group-hover:block" />

                      <input
                        type="file"
                        name="avatarFile"
                        id="avatarFile"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleChangeImage}
                        multiple={false}
                      />
                    </label>
                  )}
                  {!objectImage && userProfile.data?.image && (
                    <Image
                      src={userProfile.data?.image}
                      alt={userProfile.data?.name ?? ""}
                      fill
                      className="rounded-full "
                    />
                  )}
                  {objectImage && (
                    <Image
                      src={objectImage}
                      alt={userProfile.data?.name ?? ""}
                      fill
                      className="rounded-full "
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="ml-12 mt-10 flex flex-col space-y-0.5  rounded-b-3xl py-5">
              <div className="text-2xl font-semibold text-gray-800">
                {userProfile.data?.name}
              </div>
              <div className="text-gray-600">@{userProfile.data?.username}</div>
              <div className="text-gray-600">
                {userProfile.data?._count.posts ?? 0} Posts
              </div>
              <div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("URL copied to clipboard 🥳");
                  }}
                  className="flex transform items-center space-x-3 rounded border border-gray-200 px-4 py-2.5  transition hover:border-gray-900  hover:text-gray-900 active:scale-95"
                >
                  <div>Share</div>
                  <div>
                    <SlShareAlt />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="my-10 w-full">
            {userPosts.isSuccess &&
              userPosts.data?.posts.map((post) => (
                <Post {...post} key={post.id} />
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default UserProfilePage;

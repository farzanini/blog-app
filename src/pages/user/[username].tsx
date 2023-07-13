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
import Modal from "../../components/Modal";

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

  const [isFollowModalOpen, setIsFollowModalOpen] = useState({
    isOpen: false,
    modalType: "followers",
  });

  const followers = trpc.user.getAllFollowers.useQuery(
    {
      userId: userProfile?.data?.id as string,
    },
    {
      enabled: Boolean(userProfile?.data?.id),
    }
  );
  const followings = trpc.user.getAllFollowing.useQuery(
    {
      userId: userProfile?.data?.id as string,
    },
    {
      enabled: Boolean(userProfile?.data?.id),
    }
  );

  const followUser = trpc.user.followUser.useMutation({
    onSuccess: () => {
      userRoute.getAllFollowers.invalidate();
      userRoute.getAllFollowing.invalidate();
      userRoute.getUserProfile.invalidate();
      toast.success("user followed");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const unfollowUser = trpc.user.unfollowUser.useMutation({
    onSuccess: () => {
      userRoute.getAllFollowers.invalidate();
      userRoute.getAllFollowing.invalidate();
      userRoute.getUserProfile.invalidate();
      toast.success("user unfollowed");
    },
  });
  return (
    <MainLayout>
      {followers.isSuccess && followings.isSuccess && (
        <Modal
          isOpen={isFollowModalOpen.isOpen}
          onClose={() =>
            setIsFollowModalOpen((prev) => ({ ...prev, isOpen: false }))
          }
        >
          <div className="flex w-full max-w-lg flex-col items-center justify-center space-y-4">
            {isFollowModalOpen.modalType === "followers" &&
              followers.data?.followedBy.map((user) => (
                <div className="flex w-full flex-col justify-center">
                  <h3 className="my-2 p-2 text-xl">Followers</h3>
                  <div
                    key={user.id}
                    className="my-1 flex w-full items-center justify-between rounded-xl bg-gray-200 px-4 py-2"
                  >
                    <div>{user.name}</div>
                    <button
                      onClick={() =>
                        user.followedBy.length > 0
                          ? unfollowUser.mutate({
                              followingUserId: user.id,
                            })
                          : followUser.mutate({
                              followingUserId: user.id,
                            })
                      }
                      className="flex items-center space-x-3 rounded border
                       border-gray-400/50 px-4  py-2 transition hover:border-gray-900
                        hover:text-gray-900"
                    >
                      {user.followedBy.length > 0 ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                </div>
              ))}
            {isFollowModalOpen.modalType === " followings" &&
              followings.data?.followings.map((user) => (
                <div className="flex w-full flex-col justify-center">
                  <h3 className="my-2 p-2 text-xl">Following</h3>
                  <div
                    key={user.id}
                    className="my-1 flex w-full items-center justify-between rounded-xl bg-gray-200 px-5 py-2 "
                  >
                    <div>{user.name}</div>
                    <button
                      onClick={() =>
                        unfollowUser.mutate({
                          followingUserId: user.id,
                        })
                      }
                      className="flex items-center space-x-3 rounded border border-gray-400 px-4  py-2.5 transition hover:border-gray-900 hover:text-gray-900"
                    >
                      Unfollow
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </Modal>
      )}
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
              <div className="flex space-x-4 text-gray-700">
                <button
                  onClick={() =>
                    setIsFollowModalOpen({
                      isOpen: true,
                      modalType: "followers",
                    })
                  }
                  className="text-gray-700 hover:text-gray-900"
                >
                  <span className="text-gray-900">
                    {userProfile.data?._count.followedBy}
                  </span>{" "}
                  Followers
                </button>
                <button
                  onClick={() =>
                    setIsFollowModalOpen({
                      isOpen: true,
                      modalType: "followings",
                    })
                  }
                  className="text-gray-700 hover:text-gray-900"
                >
                  <span className="text-gray-900">
                    {userProfile.data?._count.followings}
                  </span>{" "}
                  Followings
                </button>
              </div>
              <div className=" flex w-full items-center space-x-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("URL copied to clipboard 🥳");
                  }}
                  className="mt-2 flex transform items-center space-x-3 rounded border border-gray-200 px-4 py-2.5  transition hover:border-gray-900  hover:text-gray-900 active:scale-95"
                >
                  <div>Share</div>
                  <div>
                    <SlShareAlt />
                  </div>
                </button>
                {userProfile.isSuccess && userProfile.data?.followedBy && (
                  <button
                    onClick={() => {
                      if (userProfile.data?.id) {
                        userProfile.data.followedBy.length > 0
                          ? unfollowUser.mutate({
                              followingUserId: userProfile.data.id,
                            })
                          : followUser.mutate({
                              followingUserId: userProfile.data.id,
                            });
                      }
                    }}
                    className="mt-2 flex items-center space-x-3 rounded border
                       border-gray-400/50 px-4  py-2 transition hover:border-gray-900
                        hover:text-gray-900"
                  >
                    {userProfile.data?.followedBy.length > 0
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
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

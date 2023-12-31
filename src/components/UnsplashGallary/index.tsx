import React, { useState } from "react";

import Modal from "../Modal";
import Image from "next/image";
import toast from "react-hot-toast";
import { trpc } from "../../utils/trpc";
import useDebounce from "../../hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BiLoaderAlt } from "react-icons/bi";

export const unsplashSearchRouteSchema = z.object({
  searchQuery: z.string().min(5),
});

type UnplashGallaryProps = {
  isUnsplashModalOpen: boolean;
  setIsUnsplashModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  slug: string;
};
function UnsplashGallary({
  isUnsplashModalOpen,
  setIsUnsplashModalOpen,
  postId,
  slug,
}: UnplashGallaryProps) {
  const { register, watch, reset } = useForm<{ searchQuery: string }>({
    resolver: zodResolver(unsplashSearchRouteSchema),
  });

  const watchSearchQuery = watch("searchQuery");
  const debouncedSearchQuery = useDebounce(watchSearchQuery, 3000);

  const [selectedImage, setSelectedImage] = useState("");

  const fetchUnsplashImages = trpc.unsplash.getImages.useQuery(
    {
      searchQuery: debouncedSearchQuery,
    },
    {
      enabled: Boolean(debouncedSearchQuery),
    }
  );

  const utils = trpc.useContext();

  const updateFeaturedImage = trpc.post.updatePostFeaturedImage.useMutation({
    onSuccess: () => {
      setIsUnsplashModalOpen(false);
      reset;
      toast.success("featured image updated");
      utils.post.getPost.invalidate({ slug });
    },
  });
  return (
    <Modal
      isOpen={isUnsplashModalOpen}
      onClose={() => setIsUnsplashModalOpen(false)}
    >
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <input
          type="text"
          id="search"
          {...register("searchQuery")}
          className="h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600"
        />
        {debouncedSearchQuery && fetchUnsplashImages.isLoading && (
          <div className="flex h-56 w-full items-center justify-center">
            <BiLoaderAlt className="animate-spin" />
          </div>
        )}
        <div className="relative  grid h-96 w-full grid-cols-3 place-items-center gap-4 overflow-y-scroll">
          {fetchUnsplashImages.isSuccess &&
            fetchUnsplashImages.data?.results.map((imageData) => (
              <div
                key={imageData.id}
                className="group relative aspect-video h-full w-full cursor-pointer rounded-md"
                onClick={() => setSelectedImage(imageData.urls.full)}
              >
                <div
                  className={`absolute inset-0 z-10 h-full w-full rounded-md group-hover:bg-black/40 
                ${selectedImage === imageData.urls.full && "bg-black/40"}`}
                ></div>
                <Image
                  src={imageData.urls.regular}
                  alt={imageData.alt_description ?? ""}
                  fill
                  sizes="(max-width: 768px) 100vm, (max-width:1200px)50vw,33vw"
                  className=" rounded-md"
                />
              </div>
            ))}
        </div>

        {selectedImage && (
          <button
            type="submit"
            className="flex items-center space-x-3 rounded border border-gray-200 px-4  py-2.5 transition hover:border-gray-900 hover:text-gray-900"
            onClick={() => {
              updateFeaturedImage.mutate({
                imageUrl: selectedImage,
                postId,
              });
            }}
            disabled={updateFeaturedImage.isLoading}
          >
            {updateFeaturedImage.isLoading ? "Loading..." : "Confirm"}
          </button>
        )}
      </div>
    </Modal>
  );
}

export default UnsplashGallary;

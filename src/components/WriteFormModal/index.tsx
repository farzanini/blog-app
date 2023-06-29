import React, { useContext } from "react";
import Modal from "../Modal";
import { GlobalContext } from "../../contexts/GlobalContextProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type WriteFormType = {
  title: string;
  description: string;
  text: string;
};

export const writeFormSchema = z.object({
  title: z.string().min(20),
  description: z.string().min(60),
  text: z.string().min(100),
});
const WriteFormModal = () => {
  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WriteFormType>({
    resolver: zodResolver(writeFormSchema),
  });

  const postRoute = trpc.useContext().post

  const createPost = trpc.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("post created successfully!");
      setIsWriteModalOpen(false);
      reset();
      postRoute.getPosts.invalidate()
    },
  });
  const onSubmit = (data: WriteFormType) => {
    createPost.mutate(data);
  };
  return (
    <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col items-center justify-center space-y-4"
      >
        {createPost.isLoading && (
          <div className="absolute flex h-full w-full items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        )}
        <input
          type="text"
          id="title"
          className="h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600"
          placeholder="Title of the blog"
          {...register("title")}
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.title?.message}
        </p>
        <input
          type="text"
          {...register("description")}
          id="shortDescription"
          className="h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600"
          placeholder="Short Description aboutr the blog"
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.description?.message}
        </p>

        <textarea
          {...register("text")}
          id="mainText"
          cols={10}
          rows={10}
          className="h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600"
          placeholder="bolg main text ..."
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.text?.message}
        </p>
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-3 rounded border border-gray-200 px-4  py-2.5 transition hover:border-gray-900 hover:text-gray-900"
          >
            Publish
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WriteFormModal;

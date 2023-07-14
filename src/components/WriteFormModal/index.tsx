import React, { useContext, useState } from "react";
import Modal from "../Modal";
import { GlobalContext } from "../../contexts/GlobalContextProvider";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TagsAutoComplete from "../TagsAutoComplete";
import TagForm from "../TagForm";
import { FaTimes } from "react-icons/fa";
import "react-quill/dist/quill.snow.css";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export type TAG = { id: string; name: string };

type WriteFormType = {
  title: string;
  description: string;
  text: string;
  html: string;
};

export const writeFormSchema = z.object({
  title: z.string().min(20),
  description: z.string().min(60),
  text: z.string().min(100).optional(),
  html: z.string().min(100),
});

const WriteFormModal = () => {
  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<WriteFormType>({
    resolver: zodResolver(writeFormSchema),
  });

  const postRoute = trpc.useContext().post;

  const createPost = trpc.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("post created successfully!");
      setIsWriteModalOpen(false);
      reset();
      postRoute.getPosts.invalidate();
    },
  });

  const [selectedTags, setSelectedTags] = useState<TAG[]>([]);

  const onSubmit = (data: WriteFormType) => {
    const mutationData =
      selectedTags.length > 0 ? { ...data, tagsIds: selectedTags } : data;
    createPost.mutate(mutationData);
  };
  const [isTagCreateModalOpen, setIsTagCreateModalOpen] = useState(false);

  const getTags = trpc.tag.getTags.useQuery();

  return (
    <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)}>
      {getTags.isSuccess && (
        <>
          <TagForm
            isOpen={isTagCreateModalOpen}
            onClose={() => setIsTagCreateModalOpen(false)}
          />
          <div className="my-4 flex w-full items-center space-x-4">
            <div className="z-10 w-4/5">
              <TagsAutoComplete
                tags={getTags.data}
                setSelectedTags={setSelectedTags}
                selectedTags={selectedTags}
              />
            </div>
            <button
              onClick={() => setIsTagCreateModalOpen(true)}
              className="space-x-3 whitespace-nowrap rounded border border-gray-200 px-4 py-2.5  text-sm transition hover:border-gray-900 hover:text-gray-900"
              type="submit"
            >
              Create Tag
            </button>
          </div>
          <div className="my-4 flex w-full flex-wrap items-center">
            {selectedTags.map((tag) => (
              <div
                key={tag.id}
                className="m-2 flex  items-center justify-center space-x-2 rounded-2xl bg-gray-200/50 px-5 py-3"
              >
                <div>{tag.name}</div>
                <div
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.filter((currTag) => currTag.id !== tag.id)
                    )
                  }
                  className="cursor-pointer text-red-400"
                >
                  <FaTimes />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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

        {/* <textarea
          {...register("text")}
          id="mainText"
          cols={10}
          rows={10}
          className="h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600"
          placeholder="bolg main text ..."
        /> */}
        <Controller
          name="html"
          control={control}
          render={({ field }) => (
            <div className="w-full">
              <ReactQuill
                theme="snow"
                {...field}
                placeholder="Write the blog here"
                value={field.value}
                onChange={(value) => field.onChange(value)}
              />
            </div>
          )}
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

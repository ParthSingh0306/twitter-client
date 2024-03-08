"use client";
import Image from "next/image";

import FeedCard from "@/components/FeedCard";
import { useCallback, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Layout";
import { BiImageAlt } from "react-icons/bi";
import { graphQLClient } from "@/clients/api";
import { getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();
  const { mutate } = useCreateTweet();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if(!file) return;

      const { getSignedURLForTweet } = await graphQLClient.request(getSignedURLForTweetQuery, {
        imageName: file.name,
        imageType: file.type,
      });

      if(getSignedURLForTweet) {
        toast.loading("Uploading image...", { id: '2' });
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            "Content-Type": file.type
          }
        });
        toast.success("Uploaded image!", { id: '2' });
        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath);
      }
    }
  }, [])

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handler = handleInputChangeFile(input);
    input.addEventListener("change", handler);
    input.click();
  }, [handleInputChangeFile]);

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
      imageURL
    });
  }, [content, mutate, imageURL]);

  return (
    <div>
      <TwitterLayout>
        <div>
          <div className="border border-l-0 border-b-0 border-r-0 border-gray-600 p-4 transition-all hover:bg-gray-900 cursor-pointer">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={60}
                    width={60}
                  />
                )}
              </div>
              <div className="col-span-11">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-lg px-3 border-b border-slate-700 no-scrollbar"
                  placeholder="What's Happening?"
                  rows={3}
                ></textarea>
                {
                  imageURL && <Image src={imageURL} alt="tweet-image" width={300} height={300} />
                }
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                  <button
                    onClick={handleCreateTweet}
                    className="bg-[#1d9bf0] font-semibold rounded-full text-sm px-4 py-2"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </TwitterLayout>
    </div>
  );
}

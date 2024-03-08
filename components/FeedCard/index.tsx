import React from "react";
import Image from "next/image";

import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { LuUpload } from "react-icons/lu";
import { Tweet } from "@/gql/graphql";

interface FeedCardProps {
  data: Tweet
}

const FeedCard: React.FC<FeedCardProps> = (props) => {

  const { data } = props


  return (
    <div className="border border-l-0 border-b-0 border-r-0 border-gray-600 p-4 transition-all hover:bg-gray-900 cursor-pointer">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-1">
          {data.author?.profileImageURL && <Image
            className="rounded-full"
            src={data.author?.profileImageURL }
            alt="user-image"
            height={60}
            width={60}
          />}
        </div>
        <div className="col-span-11 ml-1">
          <h1>{data.author?.firstName} {data.author?.lastName}</h1>
          <p className="text-xs">
            {data.content}
          </p>
          {
            data.imageURL && <Image src={data.imageURL} alt="tweet-image" width={300} height={300} />
          }
          <div className="flex justify-between items-center mt-5 p-1 w-[90%]">
            <div className="p-1.5 rounded-full hover:bg-gray-800">
                <BiMessageRounded />
            </div>
            <div className="p-1.5 rounded-full hover:bg-gray-800">
                <AiOutlineRetweet />
            </div>
            <div className="p-1.5 rounded-full hover:bg-gray-800">
                <FaRegHeart />
            </div>
            <div className="p-1.5 rounded-full hover:bg-gray-800">
                <LuUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;

import React from "react";
import Image from "next/image";

import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { LuUpload } from "react-icons/lu";

const FeedCard: React.FC = () => {
  return (
    <div className="border border-l-0 border-b-0 border-r-0 border-gray-600 p-4 transition-all hover:bg-gray-900 cursor-pointer">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-1">
          <Image
            className="rounded-full"
            src="https://avatars.githubusercontent.com/u/99341523?v=4"
            alt="user-image"
            height={60}
            width={60}
          />
        </div>
        <div className="col-span-11 ml-1">
          <h1>Parth Singh</h1>
          <p className="text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore reiciendis, aspernatur consectetur impedit vitae fuga velit iste aut quaerat voluptates animi quidem sed sunt nostrum suscipit amet ipsa perferendis cumque. </p>
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

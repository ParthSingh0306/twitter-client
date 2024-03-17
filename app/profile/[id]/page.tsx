"use client";

import { BsArrowLeftShort } from "react-icons/bs";
import Image from "next/image";
import { useCurrentUser, useUserInfo } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import FeedCard from "@/components/FeedCard";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Layout";

const UserProfilePage = () => {
  // const { user: currentUser } = useCurrentUser();
  // const queryClient = useQueryClient();

  const params = useParams();
  const { user: userInfo } = useUserInfo(params?.id as string);

  return (
    <TwitterLayout>
    <div>
      <nav className="flex items-center gap-3 py-3 px-3">
        <BsArrowLeftShort className="text-4xl" />
        <div>
          <h1 className="text-2xl font-bold"> {userInfo?.firstName} {userInfo?.lastName} </h1>
          <h1 className="text-md font-bold text-slate-500"> {userInfo?.tweets?.length} Tweets </h1>
        </div>
      </nav>
      <div className="p-4 border-b border-slate-800">
        {userInfo?.profileImageURL && (
          <Image
            src={userInfo?.profileImageURL}
            alt="user-image"
            className="rounded-full"
            width={100}
            height={100}
          />
        )}
        <h1 className="text-2xl font-bold mt-5">
          {userInfo?.firstName} {userInfo?.lastName}
        </h1>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span>{userInfo?.followers?.length} followers</span>
            <span>{userInfo?.following?.length} following</span>
          </div>
          <button className="bg-white text-black px-3 py-1 rounded-full text-sm">
            Follow
          </button>
        </div>
      </div>
      <div>
        {userInfo?.tweets?.map((tweet) => (
          <FeedCard data={tweet as Tweet} key={tweet?.id} />
        ))}
      </div>
    </div>
    </TwitterLayout>
  );
};

export default UserProfilePage;
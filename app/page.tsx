"use client";
import { BsTwitterX } from "react-icons/bs";
import { BiHomeCircle } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { RiNotificationLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { PiBookmarkSimpleBold } from "react-icons/pi";
import { BsPerson } from "react-icons/bs";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Image from "next/image";

import FeedCard from "@/components/FeedCard";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <FiSearch />,
  },
  {
    title: "Notifications",
    icon: <RiNotificationLine />,
  },
  {
    title: "Messages",
    icon: <MdOutlineEmail />,
  },
  {
    title: "Bookmarks",
    icon: <PiBookmarkSimpleBold />,
  },
  {
    title: "Profile",
    icon: <BsPerson />,
  },
];

export default function Home() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  console.log(user);

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google Token not Found!`);
      const { verifyGoogleToken } = await graphQLClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success(`Verified Success!`);
      console.log(verifyGoogleToken);

      if (verifyGoogleToken)
        window.localStorage.setItem("token", verifyGoogleToken);

      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    [queryClient]
  );

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-2 px-4 relative">
          <div className="text-2xl h-fit p-4 rounded-full cursor-pointer hover:bg-gray-800 w-fit">
            <BsTwitterX />
          </div>
          <div className="mt-2 text-lg font-semibold pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-2 w-fit cursor-pointer my-2"
                  key={item.title}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-1">
              <button className="bg-[#1d9bf0] rounded-full text-lg w-full px-4 py-3">
                Post
              </button>
            </div>
          </div>
          {user && (
            <div className="absolute bottom-5 cursor-pointer flex gap-2 items-center px-3 py-2 rounded-full bg-slate-800">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-image"
                  width={50}
                  height={50}
                />
              )}
              <div>
              <h3 className="text-lg">{user.firstName} {user.lastName}</h3>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-5 border-l-[0.8px] border-r-[0.8px] h-screen overflow-scroll no-scrollbar border-gray-600 transition-all">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3 p-5">
          {!user && (
            <div className="p-3 bg-slate-700 rounded-lg">
              <h1 className="my-1 text-xl font-semibold">New to Twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

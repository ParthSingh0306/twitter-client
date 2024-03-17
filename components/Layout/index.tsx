"use client";
import React, { useCallback, useMemo } from "react";
import { useCurrentUser } from "@/hooks/user";
import { BiHomeCircle } from "react-icons/bi";
import { BsPerson, BsTwitterX } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { PiBookmarkSimpleBold } from "react-icons/pi";
import { RiNotificationLine } from "react-icons/ri";

import Image from "next/image";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface TwitterLayoutProps {
  children: React.ReactNode;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const sidebarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeCircle />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <FiSearch />,
        link: "/",
      },
      {
        title: "Notifications",
        icon: <RiNotificationLine />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <MdOutlineEmail />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <PiBookmarkSimpleBold />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <BsPerson />,
        link: `/profile/${user?.id}`,
      },
    ],
    [user?.id]
  );

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
      <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
        <div className="col-span-2 sm:col-span-3 pt-2 px-2 sm:pr-4 flex sm:justify-end relative">
          <div>
            <div className="text-2xl h-fit p-4 rounded-full cursor-pointer hover:bg-gray-800 w-fit">
              <BsTwitterX />
            </div>
            <div className="mt-2 text-lg font-semibold pr-4">
              <ul>
                {sidebarMenuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-3 w-fit cursor-pointer my-2"
                      href={item.link}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="hidden sm:inline">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 px-1">
                <button className="hidden sm:block bg-[#1d9bf0] rounded-full text-lg w-full px-2 py-3">
                  Post
                </button>
                <button className="block sm:hidden bg-[#1d9bf0] rounded-full text-lg w-fit px-3 py-3">
                  <BsTwitterX />
                </button>
              </div>
            </div>
          </div>
          {user && (
            <div className="absolute bottom-5 cursor-pointer flex gap-2 items-center px-2 py-2 rounded-full bg-slate-800 mr-2">
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
                <h3 className="hidden sm:block text-lg">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-10 sm:col-span-5 border-l-[0.8px] border-r-[0.8px] h-screen overflow-scroll no-scrollbar border-gray-600 transition-all">
          {props.children}
        </div>
        <div className="col-span-0 sm:col-span-3 p-3">
          {!user ? (
            <div className="p-3 bg-slate-700 rounded-lg">
              <h1 className="my-1 text-xl font-semibold">New to Twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          ) : (
            <div className="px-4 py-3 bg-slate-800 rounded-lg">
              <h1 className="my-1 text-xl font-semibold mb-5">Users you may Know</h1>
              {user?.recommendedUsers?.map((el) => (
                <div className="flex items-center gap-3 mt-2" key={el?.id}>
                  {el?.profileImageURL && (
                    <Image
                      className="rounded-full"
                      src={el?.profileImageURL}
                      alt="user-image"
                      width={50}
                      height={50}
                    />
                  )}
                  <div>
                    <div className="text-lg" >
                      {el?.firstName} {el?.lastName}
                    </div>
                    <Link href={`/profile/${el?.id}`} className="text-sm text-black bg-white rounded-lg w-full px-3 py-1">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;

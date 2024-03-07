import TwitterLayout from "@/components/Layout";
import Image from "next/image";
import type { NextPage } from "next";
import { BsArrowLeft } from "react-icons/bs";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { graphQLClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";

interface UserData {
  userInfo: User;
}

async function getData(id: string): Promise<UserData> {
  const userInfo = await graphQLClient.request(getUserByIdQuery, { id });
  return { userInfo: userInfo?.getUserById as User };
}

const UserProfilePage: NextPage = async ({ params } : any) => {
  const userData = await getData(params.id);
  const userJson = JSON.stringify(userData);
  const user = JSON.parse(userJson);
  
  return (
    <div>
      <TwitterLayout>
        <nav className="flex items-center gap-3 py-3 px-3">
          <BsArrowLeft className="text-2xl" />
          <div>
            <h1 className="text-xl font-bold">{user.userInfo?.firstName} {user.userInfo?.lastName}</h1>
            <h1 className="text-md font-bold text-slate-800">{user.userInfo?.tweets?.length} Tweets</h1>
          </div>
        </nav>
        <div className="p-4 border-b border-slate-600">
          {user.userInfo?.profileImageURL && (
            <Image
              className="rounded-full"
              src={user.userInfo?.profileImageURL}
              alt="user-image"
              width={100}
              height={100}
            />
          )}
          <h1 className="text-xl font-bold mt-5">Parth Singh</h1>
        </div>
        <div>
          {user.userInfo?.tweets &&
            user.userInfo?.tweets.map(
              (tweet) =>
                tweet && <FeedCard data={tweet as Tweet} key={tweet.id} />
            )}
        </div>
      </TwitterLayout>
    </div>
  );
};

export default UserProfilePage;

import { type NextPage } from "next";
import Head from "next/head";
import { LoadingContainer } from "~/components/ui/Loading";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { data: profile, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "bambooderen",
  });

  if (isLoading) return <LoadingContainer />;

  if (!profile) return <div>404</div>;

  return (
    <>
      <Head>
        <title>Deren T3 Twitter - Profile</title>
      </Head>
      <main className="flex min-h-screen justify-center bg-gray-800 text-white">
        <div className="w-full border-x border-slate-200 md:max-w-3xl">
          <div className="flex border-b border-slate-200 p-4">Profile View</div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;

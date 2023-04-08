import { type NextPage } from "next";
import Head from "next/head";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Deren T3 Twitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
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

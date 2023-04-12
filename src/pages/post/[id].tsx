import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const PostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Deren T3 Twitter - Post</title>
      </Head>
      <main className="flex min-h-screen justify-center bg-gray-800 text-white">
        <div className="w-full border-x border-slate-200 md:max-w-3xl">
          <div className="flex border-b border-slate-200 p-4">Post View</div>
        </div>
      </main>
    </>
  );
};

export default PostPage;

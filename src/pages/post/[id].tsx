import {
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import Head from "next/head";
import { PageLayout } from "~/components/PageLayout";
import { PostView } from "~/components/PostView";
import { LoadingContainer } from "~/components/ui/Loading";
import { api } from "~/utils/api";
import { createSSGHelper } from "~/utils/ssgHelper";

type PostPageProps = InferGetStaticPropsType<typeof getStaticProps>;
const PostPage: NextPage<PostPageProps> = ({ id }) => {
  const { data, isLoading } = api.post.getById.useQuery({
    id,
  });

  if (isLoading) return <LoadingContainer />;

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView postWithAuthor={data} />
      </PageLayout>
    </>
  );
};

export default PostPage;

type profilePageStaticProps = {
  id: string;
};

export const getStaticProps: GetStaticProps<profilePageStaticProps> = async (
  context
) => {
  const helpers = createSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await helpers.post.getById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

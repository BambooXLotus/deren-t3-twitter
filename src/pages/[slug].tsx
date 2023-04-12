import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import superjson from "superjson";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { LoadingContainer } from "~/components/ui/Loading";
import PageLayout from "~/components/PageLayout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { PostView } from "~/components/PostView";

type FeedProps = {
  userId: string;
};

const Feed: React.FC<FeedProps> = ({ userId }) => {
  const { data: posts, isLoading } = api.post.getPostsByUserId.useQuery({
    userId,
  });

  if (isLoading) return <LoadingContainer />;

  if (!posts) return <div>Something wong</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostView key={post.post.id} postWithAuthor={post} />
      ))}
    </div>
  );
};

type ProfilePageProps = InferGetStaticPropsType<typeof getStaticProps>;
const ProfilePage: NextPage<ProfilePageProps> = ({ username }) => {
  const { data: profile, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (isLoading) return <LoadingContainer />;

  if (!profile) return <div>404</div>;

  return (
    <PageLayout>
      <div className="relative h-48 bg-slate-600">
        <Avatar className="absolute bottom-0 left-0 -mb-16 ml-4 h-32 w-32 border-4 border-gray-800">
          <AvatarImage src={profile.profileImageUrl} />
          <AvatarFallback>DS</AvatarFallback>
        </Avatar>
      </div>
      <div className="h-16"></div>
      <div className="p-4 text-2xl font-bold">{`@${
        profile.username ?? "none"
      }`}</div>
      <div className="border-b border-slate-200"></div>
      <Feed userId={profile.id} />
    </PageLayout>
  );
};

export default ProfilePage;

type profilePageStaticProps = {
  username: string;
};

export const getStaticProps: GetStaticProps<profilePageStaticProps> = async (
  context
) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      userId: null,
    },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  await helpers.profile.getUserByUsername.prefetch({ username: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username: slug,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

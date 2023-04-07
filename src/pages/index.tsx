import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";
import TimeAgo from "react-timeago";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { Input } from "~/components/ui/Input";
import { LoadingContainer } from "~/components/ui/Loading";
import { api, type RouterOutputs } from "~/utils/api";

type CreatePostWizardProps = {
  id?: string;
};

const CreatePostWizard: React.FC<CreatePostWizardProps> = () => {
  const [content, setContent] = useState("");

  const { user } = useUser();
  const context = api.useContext();

  const { mutate: createPost, isLoading: isPosting } =
    api.post.create.useMutation({
      onSuccess: () => {
        setContent("");
        void context.post.getAll.invalidate();
      },
      onError: (error) => {
        //TODO: move this stuff to a helper
        const errorMessage = error.data?.zodError?.fieldErrors.content;

        console.log(errorMessage);
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        }
      },
    });

  if (!user) return null;

  function handleCreatePost(event: React.FormEvent) {
    event.preventDefault();

    createPost({
      content,
    });
  }

  return (
    <div className="space-2 flex w-full items-center gap-2">
      <Avatar>
        <AvatarImage src={user.profileImageUrl} />
        <AvatarFallback>DS</AvatarFallback>
      </Avatar>
      <form
        action="submit"
        onSubmit={(event) => handleCreatePost(event)}
        className="flex-1"
      >
        <Input
          placeholder="Type a post..."
          disabled={isPosting}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </form>
    </div>
  );
};

type PostWithAuthor = RouterOutputs["post"]["getAll"][number];
type PostViewProps = {
  postWithAuthor: PostWithAuthor;
};

const PostView: React.FC<PostViewProps> = ({
  postWithAuthor: { post, author },
}) => {
  return (
    <div className="flex gap-2 border-b border-slate-200 p-3 ">
      {author && (
        <Avatar>
          <AvatarImage src={author.profileImageUrl} />
          <AvatarFallback>DS</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <span className="text-xs text-slate-400">
          {`@${author.username} · `}
          <span className="font-thin">
            <TimeAgo date={post.updatedAt} />
          </span>
        </span>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

type FeedProps = {
  id?: string;
};

const Feed: React.FC<FeedProps> = () => {
  const { data: posts, isLoading } = api.post.getAll.useQuery();

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

const Home: NextPage = () => {
  const { isSignedIn } = useUser();

  //Start Fetching Early
  api.post.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Deren T3 Twitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center bg-gray-800 text-white">
        <div className="w-full border-x border-slate-200 md:max-w-3xl">
          <div className="flex border-b border-slate-200 p-4">
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
            <div>{!isSignedIn && <SignInButton />}</div>

            {isSignedIn && (
              <div className="w-full">
                <CreatePostWizard />
                <SignOutButton />
              </div>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;

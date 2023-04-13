import { type PostWithAuthor } from "~/types/types";

import { PostView } from "./PostView";

type PostFeedProps = {
  posts: PostWithAuthor[];
};

export const PostFeed: React.FC<PostFeedProps> = ({ posts }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostView key={post.post.id} postWithAuthor={post} />
      ))}
    </div>
  );
};

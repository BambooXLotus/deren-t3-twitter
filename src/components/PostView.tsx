import Link from "next/link";
import ReactTimeago from "react-timeago";
import { type PostWithAuthor } from "~/types/types";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

type PostViewProps = {
  postWithAuthor: PostWithAuthor;
};

export const PostView: React.FC<PostViewProps> = ({
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
        <span className="text-xs font-thin">
          <Link href={`/${author.username}`}>
            <span className="text-sm text-slate-400">{`@${author.username}`}</span>
          </Link>
          {` · `}
          <Link href={`/post/${post.id}`}>
            <ReactTimeago date={post.updatedAt} />
          </Link>
        </span>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "~/components/ui/Input";
import { LoadingContainer } from "~/components/ui/Loading";
import { api } from "~/utils/api";

export const PostInput: React.FC = () => {
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
      <UserButton />
      <form
        action="submit"
        onSubmit={(event) => handleCreatePost(event)}
        className="flex-1"
      >
        {isPosting ? (
          true && <LoadingContainer size={30} />
        ) : (
          <Input
            placeholder="Type a post..."
            disabled={isPosting}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        )}
      </form>
    </div>
  );
};

import { type PropsWithChildren } from "react";

type PageLayoutProps = {
  id?: string;
} & PropsWithChildren;

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <main className="flex min-h-screen justify-center bg-gray-800 text-white">
      <div className="w-full border-x border-slate-200 md:max-w-3xl">
        {children}
      </div>
    </main>
  );
};

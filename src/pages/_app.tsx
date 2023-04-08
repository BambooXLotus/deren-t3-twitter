import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }} {...pageProps}>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

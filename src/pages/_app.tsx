import "~/styles/globals.css";

import { dark } from "@clerk/themes";

import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }} {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

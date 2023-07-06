import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import mixpanel from "mixpanel-browser";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useMemo } from "react";

import "../styles/globals.css";
import { MixpanelProvider } from "@/hooks/useMixpanel";
import { getClient } from "@/lib/client";

type AppPropsWithLayout = Omit<AppProps, "router"> & {
  Component: NextPageWithLayout;
};

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: JSX.Element) => JSX.Element;
};

type CustomPageProps = {
  currentPage: "projects" | "settings" | undefined;
  hasHeader: boolean | undefined;
};

const App: React.FC<AppProps<CustomPageProps>> = ({ Component, pageProps }) => {
  const apolloClient = getClient();
  const mixpanelInstance = useMemo(
    () =>
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_MIXPANEL_AUTH_TOKEN
        ? mixpanel.init(
            process.env.NEXT_PUBLIC_MIXPANEL_AUTH_TOKEN,
            {
              debug: true,
            },
            "app"
          )
        : undefined,
    []
  );

  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
          <MixpanelProvider mixpanel={mixpanelInstance}>
            <Head>
              <title>App</title>
            </Head>
            <Layout
              Component={Component}
              pageProps={pageProps as unknown}
            />
          </MixpanelProvider>
      </UserProvider>
    </ApolloProvider>
  );
};

export const Layout = ({
  Component,
  pageProps,
}: AppPropsWithLayout): JSX.Element => {
  const getLayout = Component.getLayout ?? ((page) => page);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return getLayout(<Component {...pageProps} />);
};

export default App;

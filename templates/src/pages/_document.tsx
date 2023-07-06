import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

const Document: React.FC = () => {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/oob5pgn.css" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig: _withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOST_NAME: process.env.HOST_NAME,
  },
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "s.gravatar.com",
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

const withSentryConfig = process.env.SENTRY_AUTH_TOKEN
  ? _withSentryConfig
  : (x) => x;

module.exports = withSentryConfig(
  nextConfig,
  { silent: true },
  { hideSourcemaps: true }
);

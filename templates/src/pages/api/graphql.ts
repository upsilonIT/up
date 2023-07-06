import assert from "assert";

import { getAccessToken, GetAccessTokenResult } from "@auth0/nextjs-auth0";
import httpProxy from "http-proxy";
import { NextApiRequest, NextApiResponse } from "next";

import { getTenant } from "@/utils/getTenant";

const AUTH_IGNORE_LIST = ["/presentation"];

const API_URL = process.env.API_URL;

assert(API_URL, "Expected API_URL env variable to exist");

const proxy = httpProxy.createProxyServer();

// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const url = new URL(req.headers.referer ?? "");

  const excludedPath = AUTH_IGNORE_LIST.some((path) =>
    url.pathname.startsWith(path)
  );
  let token: GetAccessTokenResult | null;

  try {
    token = excludedPath ? null : await getAccessToken(req, res);
  } catch (err) {
    res.status(500).send({ message: "token expired" });

    return Promise.resolve();
  }
  const tenant = getTenant(url.host);
  const organization = excludedPath
    ? ""
    : tenant.length
    ? tenant
    : url.pathname.split("/")[1];

  const target = new URL("/graphql", API_URL);

  return new Promise((resolve, reject) => {
    proxy.web(
      req,
      res,
      {
        target: target.toString(),
        changeOrigin: true,
        ignorePath: true,
        proxyTimeout: 10_000,
        headers: {
          Authorization: token?.accessToken
            ? `Bearer ${token.accessToken}`
            : "",
          "x-organization": organization,
        },
      },
      (err: unknown): void => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

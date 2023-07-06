// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever middleware or an Edge route handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { CaptureConsole } from "@sentry/integrations";


Sentry.init({
  environment: process.env.SENTRY_ENVIRONMENT,
  enabled: !!process.env.SENTRY_ENVIRONMENT,
  integrations: [
    new CaptureConsole({
      levels: ["error"],
    }),
  ],
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.25,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});

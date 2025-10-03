import { RuntimeEnvironment } from './types/app.types';

const {
  PUBLIC_API_BASE_URL,
  PUBLIC_BASE_URL,
  PUBLIC_BUILD_BRANCH,
  PUBLIC_BUILD_COMMIT,
  PUBLIC_BUILD_DATE,
  PUBLIC_BUILD_ID,
  PUBLIC_CLERK_CLIENT_KEY,
  PUBLIC_GA_ID,
  PUBLIC_POSTHOG_API_KEY,
  PUBLIC_RUNTIME_ENVIRONMENT,
  PUBLIC_SHOP_BASE_URL,
} = process.env;

export const config = {
  api: {
    baseUrl: PUBLIC_API_BASE_URL as string,
    name: 'core',
  },
  app: {
    audioPlaybackSpeedDefaultMap: {
      0.25: 0.25,
      0.5: 0.5,
      0.75: 0.75,
      1: 1.0,
      1.25: 1.25,
      1.5: 1.5,
      1.75: 1.75,
      2.0: 2.0,
    },
    baseUrl: PUBLIC_BASE_URL as string,
    clerkClientKey: PUBLIC_CLERK_CLIENT_KEY as string,
    itemsPerPage: 16,
    mobileBreakpoint: 1024,
    renderAllBadges: true,
    runtimeEnvironment: PUBLIC_RUNTIME_ENVIRONMENT as RuntimeEnvironment,
    shopifyUrl: PUBLIC_SHOP_BASE_URL as string,
    supportMail: 'support@adaptivereader.com',
  },
  ...(PUBLIC_BUILD_BRANCH &&
    PUBLIC_BUILD_COMMIT &&
    PUBLIC_BUILD_DATE &&
    PUBLIC_BUILD_ID && {
      build: {
        branch: PUBLIC_BUILD_BRANCH,
        commit: PUBLIC_BUILD_COMMIT,
        date: PUBLIC_BUILD_DATE,
        id: PUBLIC_BUILD_ID,
      },
    }),
  ...(PUBLIC_GA_ID && {
    googleAnalytics: {
      id: PUBLIC_GA_ID as string,
    },
  }),
  ...(PUBLIC_POSTHOG_API_KEY && {
    postHog: {
      apiKey: PUBLIC_POSTHOG_API_KEY as string,
    },
  }),
};

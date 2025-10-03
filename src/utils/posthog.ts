import { config } from '@/config';
import posthog from 'posthog-js';

export function initPostHog() {
  if (config.postHog?.apiKey) {
    posthog.init(config.postHog.apiKey, {
      api_host: 'https://app.posthog.com',
      autocapture: false,
    });
  }
}

import { config } from '@/config';
import { useGetPing } from '@/queries/ping.query';
import { FunctionComponent } from 'react';

export const DebugPage: FunctionComponent = () => {
  const { data: isApiAccessable, isFetching: isApiFetching } = useGetPing();

  const pingData = {
    data: {
      api: {
        baseUrl: config.api.baseUrl,
        status: isApiFetching ? 'LOADING' : isApiAccessable ? 'OK' : 'ERROR',
      },
      build: config.build ?? null,
      googleAnalytics: {
        status: config.googleAnalytics?.id ? 'OK' : null,
      },
      health: 'OK',
      postHog: {
        status: config.postHog?.apiKey ? 'OK' : null,
      },
      runtime: config.app.runtimeEnvironment,
    },
  };

  return <div className="whitespace-pre">{JSON.stringify(pingData, null, 2)}</div>;
};

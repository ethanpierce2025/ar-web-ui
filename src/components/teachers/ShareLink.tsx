import { Event, useTrackEvent } from '@/hooks/events';
import { useGetCurrentUser } from '@/queries/users.query';
import { Feature } from '@/types/features.types';
import { getGroupCodeShareUrl } from '@/utils/sharing-url';
import { BrowserStorage } from '@/utils/storage';
import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../ui/Button';
import { CopyToClipboard } from '../ui/CopyToClipboard';

const Container = styled.div`
  background-color: var(--share-link-bg);
`;

const CopyButton = styled(Button)`
  background-color: white;
  color: var(--share-link-bg);
  font-size: 14px;
  font-weight: 700;
`;

export const ShareLink = () => {
  const { data } = useGetCurrentUser();
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  function onCopy(copied: boolean) {
    trackEvent(Event.CopiedMagicLink);
    setCopied(copied);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  }

  if (!data?.groupCode || !BrowserStorage.hasFeature(Feature.GROUP_CODES)) {
    return <></>;
  }

  return (
    <Container className="w-full py-4 px-10 md:rounded-2xl flex flex-col gap-4 text-center lg:flex-row lg:text-left  justify-between items-center">
      <p className="text-white font-primary font-bold text-[20px] mx-2 leading-8">
        Give students access through your magic link (Class Code: {data?.groupCode})
      </p>
      <CopyToClipboard
        text={getGroupCodeShareUrl(window.location.href, data.groupCode)}
        onCopy={onCopy}
      >
        <CopyButton>{copied ? 'Copied' : 'Copy Magic Link'}</CopyButton>
      </CopyToClipboard>
    </Container>
  );
};

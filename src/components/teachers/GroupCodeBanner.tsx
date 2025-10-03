import { Event, useTrackEvent } from '@/hooks/events';
import { useGetCurrentUser } from '@/queries/users.query';
import { Feature } from '@/types/features.types';
import { getGroupCodeShareUrl } from '@/utils/sharing-url';
import { BrowserStorage } from '@/utils/storage';
import { SignedIn } from '@clerk/clerk-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { CopyToClipboard } from '../ui/CopyToClipboard';

const Container = styled.div`
  background-color: var(--share-link-bg);
`;

export const GroupCodeBanner = () => {
  const { data: currentUser } = useGetCurrentUser();
  const [copied, setCopied] = useState(false);
  useLocation();
  const trackEvent = useTrackEvent();

  function onCopy(copied: boolean) {
    trackEvent(Event.CopiedMagicLink);
    setCopied(copied);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (!currentUser?.groupCode || !BrowserStorage.hasFeature(Feature.GROUP_CODES)) {
    return <></>;
  }

  return (
    <SignedIn>
      <Container className="w-full flex flex-row items-center justify-between">
        <div className="w-7xl max-w-full flex flex-row items-center justify-between mx-auto">
          <div className="text-white font-primary font-bold text-[14px] flex items-center justify-center py-3 gap-2">
            Your Class Code is {currentUser?.groupCode}.
            <CopyToClipboard
              text={getGroupCodeShareUrl(window.location.href, currentUser?.groupCode)}
              onCopy={onCopy}
            >
              <div
                className="cursor-pointer opacity-70 hover:decoration-solid hover:underline hover:opacity-100"
                title={copied ? 'Copied' : 'Copy Magic Link'}
              >
                {copied ? 'Copied' : 'Copy Magic Link'}
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </Container>
    </SignedIn>
  );
};

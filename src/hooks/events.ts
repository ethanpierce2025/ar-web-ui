import { useUser } from '@clerk/clerk-react';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export enum Event {
  ChangedAudioSettings = 'Changed Audio Settings',
  ClosedAudioPlayer = 'Closed Audio Player',
  CopiedMagicLink = 'Copied Magic Link',
  OpenedAudioPlayer = 'Opened Audio Player',
  PausedAudio = 'Paused Audio',
  ResumedAudio = 'Resumed Audio',
  SignedIn = 'Signed In',
  SignedOut = 'Signed Out',
  ViewedCatalog = 'Viewed Catalog',
  ViewedNovel = 'Viewed Novel',
  ViewedPassage = 'Viewed Passage',
  VisitedUrl = 'Visited URL',
}

export type GenericReaderProperties = {
  audio?: boolean;
  audioSpeed?: number;
  audioAutoplay?: boolean;
  fontSize?: string;
  passage: number;
  primaryEdition: string;
  primaryLanguage: string;
  primaryLevel: string;
  publication: string;
  secondaryEdition?: string;
  secondaryLanguage?: string;
  secondaryLevel?: string;
  // source: 'deepLink' | 'next' | 'prev' | 'jump' | 'navigator'; // TODO - add this
};

export type EventProperties = {
  [Event.ChangedAudioSettings]: Required<Pick<GenericReaderProperties, 'audioSpeed' | 'audioAutoplay'>>;
  [Event.ClosedAudioPlayer]: GenericReaderProperties;
  [Event.CopiedMagicLink]: undefined;
  [Event.OpenedAudioPlayer]: GenericReaderProperties;
  [Event.PausedAudio]: GenericReaderProperties;
  [Event.ResumedAudio]: GenericReaderProperties;
  [Event.SignedIn]: undefined;
  [Event.SignedOut]: undefined;
  [Event.ViewedCatalog]: { availability?: string; page: number };
  [Event.ViewedNovel]: { slug: string; version: string };
  [Event.ViewedPassage]: GenericReaderProperties;
  [Event.VisitedUrl]: { label: string; url: string };
};

export const useTrackEvent = () => {
  const posthog = usePostHog();

  const trackEvent = <T extends Event>(event: T, properties?: EventProperties[T]) => {
    try {
      posthog.capture(event, properties);
    } catch (error) {
      console.error('Error tracking event', error);
    }
  };

  return trackEvent;
};

export const useTrackSigIn = () => {
  const trackEvent = useTrackEvent();
  const { isSignedIn } = useUser();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isSignedIn) {
      trackEvent(Event.SignedIn);
    }
  }, [isSignedIn]);
};

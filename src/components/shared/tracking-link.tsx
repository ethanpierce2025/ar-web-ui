import { Event, useTrackEvent } from '@/hooks/events';
import { FunctionComponent } from 'react';

export type TrackingLinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  trackingLabel?: string;
};

export const TrackingLink: FunctionComponent<TrackingLinkProps> = (props) => {
  const { trackingLabel, ...anchorProps } = props;
  const trackEvent = useTrackEvent();

  const onClick = () => {
    const { children, href } = props;
    const label = trackingLabel || children?.toString() || 'Link';

    if (!href) return;

    trackEvent(Event.VisitedUrl, {
      label,
      url: href,
    });
  };

  return (
    <a
      {...anchorProps}
      onClick={onClick}
    />
  );
};

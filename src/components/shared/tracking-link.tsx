import { FunctionComponent } from 'react';

export type TrackingLinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  trackingLabel?: string;
};

export const TrackingLink: FunctionComponent<TrackingLinkProps> = (props) => {
  const { trackingLabel, ...anchorProps } = props;
  return <a {...anchorProps} />;
};

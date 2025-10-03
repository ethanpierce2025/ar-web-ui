import { FunctionComponent, PropsWithChildren } from 'react';
import { Link as LinkRouterDom, LinkProps as LinkRouterDomProps } from 'react-router-dom';

export type LinkProps = LinkRouterDomProps & {
  disabled?: boolean;
};

export const Link: FunctionComponent<PropsWithChildren<LinkProps>> = (props) => {
  const { children, disabled, ...linkProps } = props;

  if (disabled) {
    return <span {...linkProps}>{children}</span>;
  }

  return <LinkRouterDom {...linkProps}>{children}</LinkRouterDom>;
};

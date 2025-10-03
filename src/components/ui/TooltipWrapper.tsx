import { FunctionComponent, PropsWithChildren } from 'react';

type TooltipWrapperProps = {
  message: string;
  className?: string;
  tooltipId: string;
  delay?: number;
};
export const TooltipWrapper: FunctionComponent<PropsWithChildren<TooltipWrapperProps>> = (props) => {
  const { children, className, delay, message, tooltipId } = props;
  return (
    <div
      data-tooltip-id={tooltipId}
      data-tooltip-content={`${message}`}
      data-tooltip-delay-show={delay ?? 750}
      className={className ?? ''}
    >
      {children}
    </div>
  );
};

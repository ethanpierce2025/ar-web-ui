import { StyledElement } from '@/types/styles.types';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { TrackingLink } from '../shared/tracking-link';

const FooterContainer = styled.div.attrs<HTMLDivElement>({
  className: 'flex w-full mt-[40px]',
})`
  background-color: var(--footer-bg-color);
  color: var(--footer-font-color);
  font-size: 16px;
  line-height: 16px;
`;

export const Footer: FunctionComponent<StyledElement> = (props) => {
  const { className } = props;
  return (
    <FooterContainer className={className}>
      <div className="flex w-full justify-between w-7xl max-w-full mx-auto px-4 lg:px-12 py-5">
        <div className="flex w-1/2 flex-col gap-1 sm:gap-16 sm:flex-row sm:items-center">
          <div>
            <TrackingLink
              href="https://www.adaptivereader.com/policies/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </TrackingLink>
          </div>
          <div>
            <TrackingLink
              href="https://www.adaptivereader.com/policies/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </TrackingLink>
          </div>
        </div>
        <div className="flex justify-center items-end w-1/2 gap-1 flex-col md:flex-row md:justify-end">
          <span className="text-right">© {new Date().getFullYear()} Adaptive Reader.</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </FooterContainer>
  );
};

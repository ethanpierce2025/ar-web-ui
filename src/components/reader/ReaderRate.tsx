import { StyledElement } from '@/types/styles.types';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Dot } from '../ui/Dot';

export type ReaderRateProps = {
  fill: number;
  total: number;
} & StyledElement;

const RateContainer = styled.div.attrs<HTMLDivElement>({
  className: 'flex gap-2 h-[24px] items-center',
})``;

export const ReaderRate: FunctionComponent<ReaderRateProps> = (props) => {
  const { className, fill, total } = props;
  return (
    <RateContainer className={className}>
      {Array.from({ length: total }).map((_, index) => (
        <Dot
          key={`dot_${index}`}
          full={index < fill}
          className="h-1 w-1"
        />
      ))}
    </RateContainer>
  );
};

import React, { memo } from 'react';
import styled from 'styled-components';
import { SvgStar as StarIcon } from '~/icons/Star';

const Root = styled.div`
  position: absolute;
  left: -${(props) => props.theme.space[2]}px;
  top: ${(props) => props.theme.space[1]}px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Number = styled.span`
  position: absolute;
  width: 100%;
  color: white;
  text-align: center;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  font-size: ${(props) => props.theme.fontSizes.sm};
`;

export const Badge: React.FC<{ n: number }> = memo(function Badge({ n }) {
  return (
    <Root>
      <StarIcon height="24" width="24" />
      <Number>{n}</Number>
    </Root>
  );
});

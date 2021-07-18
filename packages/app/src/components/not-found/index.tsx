import React from 'react';
import styled from 'styled-components';
import { SvgUfo as UfoIcon } from '~/icons/Ufo';

const Root = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: ${(props) => props.theme.space[20]}px;
`;

const Text = styled.div`
  padding-top: ${(props) => props.theme.space[2]}px;
  color: ${(props) => props.theme.colors.gray5};
`;

export const NotFound: React.FC = React.memo(function NotFound() {
  return (
    <Root>
      <UfoIcon width="100" height="100" />
      <Text>Not Found</Text>
    </Root>
  );
});

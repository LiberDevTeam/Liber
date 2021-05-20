import React from 'react';
import styled from 'styled-components';
import { Loading } from '~/icons/loading';

const Root = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Text = styled.div`
  margin-left: ${(props) => props.theme.space[2]}px;
  margin-top: ${(props) => props.theme.space[4]}px;
`;

export const LoadingPage: React.FC<{ text: string }> = React.memo(
  function LoadingPage({ text }) {
    return (
      <Root>
        <Loading width={48} height={48} />
        <Text>{text}</Text>
      </Root>
    );
  }
);

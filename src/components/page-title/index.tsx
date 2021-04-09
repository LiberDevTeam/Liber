import React from 'react';
import styled from 'styled-components';

const Root = styled.h1`
  font-size: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

export interface PageTitleProps {
  children: string;
}

export const PageTitle: React.FC<PageTitleProps> = React.memo(
  function PageTitle({ children }) {
    return <Root>{children}</Root>;
  }
);

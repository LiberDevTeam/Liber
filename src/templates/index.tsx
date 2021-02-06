import { useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import styled, { css } from 'styled-components';
import { SideNavigation } from '~/components/organisms/side-navigation';

const commonRootStyle = css`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: ${(props) => props.theme.colors.bg2};
`;

const SpRoot = styled.div`
  display: block;
  ${commonRootStyle};
`;

const Root = styled.div`
  display: grid;
  grid-template-columns: 220px auto;
  grid-gap: ${(props) => props.theme.space[5]}px;
  padding: ${(props) => props.theme.space[5]}px;
  ${commonRootStyle};
`;

const Header = styled.header``;

const Main = styled.main`
  background: ${(props) => props.theme.colors.bg};
  border-radius: ${(props) => props.theme.radii.large}px;
  padding: ${(props) => props.theme.space[8]}px;
  overflow: hidden;
`;

const BaseLayout: React.FC = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return isMobile ? (
    <SpRoot>
      <Header>
        <SideNavigation />
      </Header>

      <Main>{children}</Main>
    </SpRoot>
  ) : (
    <Root>
      <Header>
        <SideNavigation />
      </Header>

      <Main>{children}</Main>
    </Root>
  );
};

export default BaseLayout;

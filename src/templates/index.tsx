import { useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import styled, { css } from 'styled-components';
import { BottomNavigation } from '~/components/organisms/bottom-navigation';
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
  grid-template-columns: 244px auto;
  grid-gap: ${(props) => props.theme.space[5]}px;
  padding: ${(props) => props.theme.space[5]}px;
  ${commonRootStyle};
`;

const SpHeader = styled.header`
  position: fixed;
  width: 100%;
  bottom: 0;
  overflow: auto;
`;

const Header = styled.header`
  height: 100%;
  overflow: auto;
`;

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
      <SpHeader>
        <BottomNavigation />
      </SpHeader>

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

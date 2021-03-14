import { useMediaQuery } from '@material-ui/core';
import React from 'react';
import styled, { css } from 'styled-components';
import { BottomNavigation } from '~/components/organisms/bottom-navigation';
import { SideNavigation } from '~/components/organisms/side-navigation';
import { theme } from '~/theme';

const commonRootStyle = css`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const SpRoot = styled.div`
  display: flex;
  flex-flow: column;
  ${commonRootStyle};
  background: white;
`;

const Root = styled.div`
  display: grid;
  grid-template-columns: 244px auto;
  grid-gap: ${(props) => props.theme.space[5]}px;
  padding: ${(props) => props.theme.space[5]}px;
  background: ${(props) => props.theme.colors.bg2};
`;

const SpNavigation = styled.nav`
  position: fixed;
  width: 100%;
  bottom: 0;
  border-top: 2px solid ${(props) => props.theme.colors.border};
  padding: 0.5rem 0;
  margin-bottom: env(safe-area-inset-bottom);
`;

const Header = styled.header`
  height: 100%;
  overflow: auto;
`;

const Main = styled.main`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.bg};
  border-radius: ${(props) => props.theme.radii.large}px;
  padding: ${(props) => props.theme.space[8]}px;
  overflow: hidden;
`;

const BaseLayout: React.FC = ({ children }) => {
  const isMobile = useMediaQuery(`(max-width:${theme.breakpoints.sm})`, {
    noSsr: true,
  });

  return isMobile ? (
    <SpRoot>
      <Main>{children}</Main>
      <SpNavigation>
        <BottomNavigation />
      </SpNavigation>
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

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BottomNavigation } from '~/components/bottomNavigation';

const commonRootStyle = css`
  width: 100vw;
  height: 100vh;
`;

const SpRoot = styled.div`
  display: flex;
  flex-flow: column;
  ${commonRootStyle};
  background: white;
`;

const SpNavigation = styled.nav`
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: ${(props) => props.theme.fontSizes.xs} 0;
  box-shadow: 0px -20px 70px rgba(143, 167, 179, 0.1);
  margin-bottom: env(safe-area-inset-bottom);
`;

const Main = styled.main`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.bg};
  border-radius: ${(props) => props.theme.radii.large}px;
  padding: ${(props) => props.theme.space[4]}px;
  padding-top: ${(props) => props.theme.space[12]}px;
  overflow: hidden;
  color: ${(props) => props.theme.colors.primaryText};
`;

const BaseLayout: React.FC = ({ children }) => {
  return (
    <SpRoot>
      <Main>{children}</Main>
      <Switch>
        <Route path="/places/*" component={() => null} />
        <Route
          path="*"
          component={() => (
            <SpNavigation>
              <BottomNavigation />
            </SpNavigation>
          )}
        />
      </Switch>
    </SpRoot>
  );
};

export default BaseLayout;

import React from 'react';
import styled from 'styled-components';
import { SideNavigation } from '~/components/side-navigation';

const Root = styled.div`
  display: grid;
  grid-template-columns: 220px auto;
  grid-gap: ${(props) => props.theme.space[5]}px;
  padding: ${(props) => props.theme.space[5]}px;
  height: 100%;
`;

const Header = styled.header``;

const Main = styled.main`
  background: ${(props) => props.theme.colors.bg};
  border-radius: ${(props) => props.theme.radii.large}px;
  padding: ${(props) => props.theme.space[8]}px;
  overflow: hidden;
`;

const BaseLayout: React.FC = ({ children }) => {
  return (
    <Root>
      <Header>
        <SideNavigation />
      </Header>

      <Main>{children}</Main>
    </Root>
  );
};

export default BaseLayout;

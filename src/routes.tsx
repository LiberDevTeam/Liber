import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import IndexPage from './pages';
import { NewPlace } from './pages/places/new';
import { history } from './state/store';
import { SideNavigation } from '~/components/side-navigation';
import styled from 'styled-components';
import { Chats } from './pages/chats';

const Root = styled.div`
  display: grid;
  grid-template-columns: 220px auto;
  grid-gap: ${(props) => props.theme.space[5]}px;
  padding: ${(props) => props.theme.space[5]}px;
  height: 100%;
`;

const Main = styled.div`
  background: ${(props) => props.theme.colors.bg};
  border-radius: ${(props) => props.theme.radii.large}px;
  padding: ${(props) => props.theme.space[8]}px;
  overflow: hidden;
`;

export const Routes: React.FC = () => (
  <ConnectedRouter history={history}>
    <Root>
      <SideNavigation />
      <Main>
        {/* your usual react-router-dom v4/v5 routing */}
        <Switch>
          <Route exact path="/" render={() => <IndexPage />} />
          <Route exact path="/places/new" render={() => <NewPlace />} />
          <Route path="/chats/:cid?" render={() => <Chats />} />
        </Switch>
      </Main>
    </Root>
  </ConnectedRouter>
);

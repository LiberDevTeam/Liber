import React, { CSSProperties } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { BackLink as BaseBackLink } from '~/components/back-link';
import { BottomNavigation } from '../components/bottom-navigation';

const PageTitle = styled.h1`
  font-size: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.primaryText};
  padding-bottom: ${(props) => props.theme.space[1]}px;
`;

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column;
  padding-top: ${(props) => props.theme.space[15]}px;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 0 ${(props) => props.theme.space[5]}px;
`;

const Description = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  word-break: break-all;
  margin-top: ${(props) => props.theme.space[1]}px;
  padding-bottom: ${(props) => props.theme.space[8]}px;
`;

const SpNavigation = styled.nav`
  position: sticky;
  width: 100%;
  bottom: 0;
  padding: ${(props) => props.theme.fontSizes.xs} 0;
  box-shadow: 0px -20px 70px rgba(143, 167, 179, 0.1);
  margin-bottom: env(safe-area-inset-bottom);
  background: #fff;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.colors.primaryText};
`;

const BackLink = styled(BaseBackLink)`
  margin-bottom: ${(props) => props.theme.space[6]}px;
`;

interface Props {
  title?: string;
  backTo?: string;
  description?: string;
  headerRightItem?: React.ReactNode;
  style?: CSSProperties;
}

const BaseLayout: React.FC<Props> = ({
  children,
  backTo,
  title,
  description,
  headerRightItem,
  style,
}) => {
  return (
    <>
      <Root style={style}>
        {title || headerRightItem ? (
          <Header>
            <div>
              {backTo && <BackLink backTo={backTo} />}
              {title && <PageTitle>{title}</PageTitle>}
              {description && <Description>{description}</Description>}
            </div>
            <div>{headerRightItem}</div>
          </Header>
        ) : null}
        <Main>{children}</Main>
      </Root>
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
    </>
  );
};

export default BaseLayout;

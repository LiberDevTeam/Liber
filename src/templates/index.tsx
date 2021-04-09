import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { SvgArrowIosBack as BackIcon } from '../icons/ArrowIosBack';
import { BottomNavigation } from '../components/bottom-navigation';
import { PageTitle } from '../components/page-title';

const Root = styled.div`
  display: flex;
  flex-flow: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: white;
  padding-top: ${(props) => props.theme.space[15]}px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 0 ${(props) => props.theme.space[7]}px;
`;

const BackLink = styled(Link)`
  display: block;
  width: 26px;
  height: 26px;
  margin-bottom: ${(props) => props.theme.space[5]}px;
`;

const Description = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  word-break: break-all;
  margin-top: ${(props) => props.theme.space[1]}px;
`;

const SpNavigation = styled.nav`
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: ${(props) => props.theme.fontSizes.xs} 0;
  box-shadow: 0px -20px 70px rgba(143, 167, 179, 0.1);
  margin-bottom: env(safe-area-inset-bottom);
  background: #fff;
`;

const Main = styled.main`
  width: 100%;
  height: 100%;
  overflow: auto;
  background: ${(props) => props.theme.colors.bg};
  border-radius: ${(props) => props.theme.radii.large}px;
  color: ${(props) => props.theme.colors.primaryText};
  padding: 0 ${(props) => props.theme.space[7]}px;
`;

interface Props {
  title?: string;
  backTo?: string;
  description?: string;
  headerRightItem?: React.ReactNode;
}

const BaseLayout: React.FC<Props> = ({
  children,
  backTo,
  title,
  description,
  headerRightItem,
}) => {
  return (
    <>
      <Root>
        <Header>
          <div>
            {backTo && (
              <BackLink to="/places">
                <BackIcon />
              </BackLink>
            )}
            {title && <PageTitle>{title}</PageTitle>}
            {description && <Description>{description}</Description>}
          </div>
          <div>{headerRightItem}</div>
        </Header>

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

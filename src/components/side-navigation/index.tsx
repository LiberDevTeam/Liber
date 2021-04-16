import {
  Add as AddIcon,
  Forum as MessagesIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SideNavLink } from '~/components/side-nav-link';
import logoText from '~/logo-text.png';
import liberLogo from '~/logo.svg';

const Root = styled.div`
  width: 244px;
  padding-right: ${(props) => props.theme.space[6]}px;
`;

const AppName = styled.div`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.space[4]}px;
`;

const LogoIcon = styled.img`
  filter: drop-shadow(0px 3px 11px rgba(46, 121, 246, 0.4));
  margin-right: ${(props) => props.theme.space[4]}px;
`;

const LinkGroup = styled.div`
  margin-top: ${(props) => props.theme.space[10]}px;

  & > a {
    margin-top: ${(props) => props.theme.space[2]}px;
  }
`;

const SubHeader = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  padding: ${(props) => `${props.theme.space[2]}px ${props.theme.space[4]}px`};
`;

export const SideNavigation: React.FC = React.memo(function SideNavigation() {
  const { t } = useTranslation(['common']);
  return (
    <Root>
      <AppName>
        <LogoIcon src={liberLogo} alt="Liber logo" />
        <img src={logoText} alt="Liber logo" height={24} />
      </AppName>

      <LinkGroup>
        <SubHeader>{t('common:PLACE')}</SubHeader>
        <SideNavLink exact icon={<SearchIcon />} to="/">
          {t('common:Explore')}
        </SideNavLink>
        <SideNavLink exact icon={<AddIcon />} to="/places/new">
          {t('common:Create new')}
        </SideNavLink>
        <SideNavLink exact icon={<MessagesIcon />} to="/places">
          {t('common:Places')}
        </SideNavLink>
      </LinkGroup>

      <LinkGroup>
        <SubHeader>{t('common:OTHERS')}</SubHeader>
        <SideNavLink exact icon={<SettingsIcon />} to="/settings">
          {t('common:Settings')}
        </SideNavLink>
      </LinkGroup>

      <LinkGroup>
        <SubHeader>{t('common:LINKS')}</SubHeader>
      </LinkGroup>
    </Root>
  );
});

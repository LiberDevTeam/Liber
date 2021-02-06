import React from 'react';
import { SideNavLink } from '~/components/atoms/side-nav-link';
import {
  Search as SearchIcon,
  List as ListIcon,
  Add as AddIcon,
  Forum as MessagesIcon,
  Settings as SettingsIcon,
  Notes as OtherIcon,
  ContactMail as ContactIcon,
  AccessTime as LiberIcon,
} from '@material-ui/icons';
import styled from 'styled-components';

const Root = styled.div`
  width: 244px;
  padding-right: ${(props) => props.theme.space[6]}px;
`;

// TODO: これは差し替える
const AppName = styled.div`
  font-size: 30px;
  display: flex;
  align-items: center;
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
  return (
    <Root>
      <AppName>
        <LiberIcon fontSize="inherit" style={{ marginRight: '8' }} />
        Liber
      </AppName>

      <LinkGroup>
        <SubHeader>PLACE</SubHeader>
        <SideNavLink exact icon={<SearchIcon />} to="/">
          Explore
        </SideNavLink>
        <SideNavLink exact icon={<ListIcon />} to="/places">
          {"You've been to"}
        </SideNavLink>
        <SideNavLink exact icon={<AddIcon />} to="/places/new">
          Create new
        </SideNavLink>
        <SideNavLink icon={<MessagesIcon />} to="/chats">
          Chats
        </SideNavLink>
      </LinkGroup>

      <LinkGroup>
        <SubHeader>OTHERS</SubHeader>
        <SideNavLink exact icon={<SettingsIcon />} to="/settings">
          Settings
        </SideNavLink>
        <SideNavLink exact icon={<OtherIcon />} to="/privacy-policy">
          Privacy Policy
        </SideNavLink>
        <SideNavLink exact icon={<OtherIcon />} to="/terms-of-service">
          Terms of Service
        </SideNavLink>
        <SideNavLink exact icon={<OtherIcon />} to="/license">
          License
        </SideNavLink>
        <SideNavLink exact icon={<ContactIcon />} to="/contact-us">
          Contact Us
        </SideNavLink>
      </LinkGroup>

      <LinkGroup>
        <SubHeader>LINKS</SubHeader>
      </LinkGroup>
    </Root>
  );
});

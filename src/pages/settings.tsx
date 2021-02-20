import React, { useCallback, useState } from 'react';
import BaseLayout from '~/templates';
import { PageTitle } from '~/components/atoms/page-title';
import { Input } from '../components/atoms/input';
import styled from 'styled-components';
import { Button } from '../components/atoms/button';
import { useDispatch, useSelector } from 'react-redux';
import { selectMe, updateUsername } from '../state/ducks/me/meSlice';
import {
  CloudDownload as DownloadIcon,
  CloudUpload as ImportIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';

const PAGE_TITLE = 'Settings';

const Contents = styled.div`
  padding-top: ${(props) => props.theme.space[9]}px;
`;

const UsernameInput = styled(Input)`
  max-width: 256px;
  margin-right: ${(props) => props.theme.space[4]}px;
`;

const InputLabel = styled.label`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const UserNameForm = styled.div`
  display: flex;
  margin-top: ${(props) => props.theme.space[4]}px;
`;

const BackupButtons = styled.div`
  display: flex;
  flex-direction: column;

  & > button {
    max-width: 300px;
    margin-top: ${(props) => props.theme.space[3]}px;
  }
`;

const SectionLabel = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  margin-top: ${(props) => props.theme.space[12]}px;
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => props.theme.space[14]}px;

  & > * {
    margin-top: ${(props) => props.theme.space[6]}px;
    color: ${(props) => props.theme.colors.secondaryText};
    font-size: ${(props) => props.theme.fontSizes.lg};
  }
`;

export const SettingsPage: React.FC = React.memo(function SettingsPage() {
  const me = useSelector(selectMe);
  const [username, setUsername] = useState(me.username);
  const dispatch = useDispatch();
  const handleUsernameChange = useCallback(() => {
    dispatch(updateUsername(username));
  }, [dispatch, username]);

  return (
    <BaseLayout>
      <PageTitle>{PAGE_TITLE}</PageTitle>
      <Contents>
        <InputLabel htmlFor="username">Username</InputLabel>
        <UserNameForm>
          <UsernameInput
            id="username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <Button
            text="Update"
            onClick={handleUsernameChange}
            shape="rounded"
            variant="outline"
          />
        </UserNameForm>

        <SectionLabel>Backup</SectionLabel>

        <BackupButtons>
          <Button
            text="Create and download backup"
            onClick={handleUsernameChange}
            shape="square"
            variant="solid"
            icon={<DownloadIcon />}
          />

          <Button
            text="Import backup"
            onClick={handleUsernameChange}
            shape="square"
            variant="outline"
            icon={<ImportIcon />}
          />
        </BackupButtons>

        <Links>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
          <Link to="/">License</Link>
          <Link to="/">Contact Us</Link>
        </Links>
      </Contents>
    </BaseLayout>
  );
});

import React, { useCallback } from 'react';
import BaseLayout from '~/templates';
import { PageTitle } from '~/components/atoms/page-title';
import { ToggleSwitch } from '~/components/atoms/toggle-switch';
import styled from 'styled-components';
import { Button } from '../components/atoms/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectMe,
  updateUsername,
  updateIsolationMode,
} from '../state/ducks/me/meSlice';
import {
  CloudDownload as DownloadIcon,
  CloudUpload as ImportIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { SettingSection } from '~/components/organisms/setting-section';
import { TextFormWithSubmit } from '~/components/molecules/textform-with-submit';

const PAGE_TITLE = 'Settings';

const Contents = styled.div`
  padding-top: ${(props) => props.theme.space[9]}px;
`;

const BackupButtons = styled.div`
  display: flex;
  flex-direction: column;

  & > button {
    max-width: 300px;
    margin-top: ${(props) => props.theme.space[3]}px;
  }
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
  const dispatch = useDispatch();
  const handleUsernameChange = (username: string) =>
    dispatch(updateUsername(username));
  const handleExportBackup = useCallback(() => {
    console.log('export');
  }, []);
  const handleImportBackup = useCallback(() => {
    console.log('import');
  }, []);
  const handleChangeIsolation = (isIsolation: boolean) =>
    dispatch(updateIsolationMode(isIsolation));

  return (
    <BaseLayout>
      <PageTitle>{PAGE_TITLE}</PageTitle>
      <Contents>
        <SettingSection title="Username">
          <TextFormWithSubmit
            buttonName="Update"
            defaultText={me.username}
            onSubmit={handleUsernameChange}
          />
        </SettingSection>

        <SettingSection title="Backup">
          <BackupButtons>
            <Button
              text="Create and download backup"
              onClick={handleExportBackup}
              shape="square"
              variant="solid"
              icon={<DownloadIcon />}
            />

            <Button
              text="Import backup"
              onClick={handleImportBackup}
              shape="square"
              variant="outline"
              icon={<ImportIcon />}
            />
          </BackupButtons>
        </SettingSection>

        <SettingSection
          title="Isolation mode"
          description="If this mode is enabled, the application is isolated from everything of the Liber Search functionality."
        >
          <ToggleSwitch
            checked={me.settings.isIsolation}
            onChange={handleChangeIsolation}
          />
        </SettingSection>

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

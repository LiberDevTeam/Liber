import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BaseLayout from '~/templates';
import { PageTitle } from '~/components/page-title';
import { ToggleSwitch } from '~/components/toggle-switch';
import styled, { keyframes } from 'styled-components';
import { Button } from '../../components/button';
import { useDispatch, useSelector } from 'react-redux';
import { selectMe, updateIsolationMode } from '../../state/ducks/me/meSlice';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import ImportIcon from '@material-ui/icons/CloudUpload';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { Link } from 'react-router-dom';
import { SettingSection } from '~/components/setting-section';
import { TextFormWithSubmit } from '~/components/textform-with-submit';
import { downloadIdbBackup, uploadIdbBackup } from '~/lib/indexedDB';
import { useTranslation } from 'react-i18next';

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

const rotate = keyframes`
  from {
    transform: rotateZ(0);
    }
  to {
    transform: rotateZ(360deg);
  }
`;

const LoadingIcon = styled(AutorenewIcon)`
  animation: ${rotate} 0.5s linear infinite;
`;

export const SettingsPage: React.FC = React.memo(function SettingsPage() {
  const me = useSelector(selectMe);
  const dispatch = useDispatch();
  const { t } = useTranslation(['common', 'settings']);
  const handleExportBackup = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      await downloadIdbBackup();
    },
    []
  );
  const handleImportBackup = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsImporting(true);
      await uploadIdbBackup().finally(() => setIsImporting(false));
    },
    []
  );
  const handleChangeIsolation = (isIsolation: boolean) =>
    dispatch(updateIsolationMode(isIsolation));

  const [isImporting, setIsImporting] = useState<boolean>(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isBeforeIsolation = useMemo(() => me.settings.isIsolation, []);

  useEffect(() => {
    if (isBeforeIsolation !== me.settings.isIsolation) {
      setTimeout(() => window?.location.reload(), 600);
    }
  }, [isBeforeIsolation, me.settings.isIsolation]);

  return (
    <BaseLayout>
      <PageTitle>{PAGE_TITLE}</PageTitle>
      <Contents>
        <SettingSection title={t('common:Username')}></SettingSection>

        <SettingSection title={t('settings:Backup')}>
          <BackupButtons>
            <Button
              text={t('settings:Create and download backup')}
              onClick={handleExportBackup}
              shape="square"
              variant="solid"
              icon={<DownloadIcon />}
            />

            <Button
              text={t('settings:Import backup')}
              onClick={handleImportBackup}
              shape="square"
              variant="outline"
              icon={isImporting ? <LoadingIcon /> : <ImportIcon />}
            />
          </BackupButtons>
        </SettingSection>

        <SettingSection
          title={t('settings:Isolation mode')}
          description={t(
            'settings:If this mode is enabled, the application is isolated from everything of the Liber Search functionality'
          )}
        >
          <ToggleSwitch
            checked={me.settings.isIsolation}
            onChange={handleChangeIsolation}
          />
        </SettingSection>

        <Links>
          <Link to="/">{t('common:Privacy Policy')}</Link>
          <Link to="/">{t('common:Terms of Service')}</Link>
          <Link to="/">{t('common:License')}</Link>
          <Link to="/">{t('common:Contact Us')}</Link>
        </Links>
      </Contents>
    </BaseLayout>
  );
});

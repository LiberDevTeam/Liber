import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as BaseLink } from 'react-router-dom';
import styled from 'styled-components';
import { Button as BaseButton } from '~/components/button';
import { Menu, MenuItem, MenuTitle } from '~/components/icon-menu';
import { ToggleSwitch } from '~/components/toggle-switch';
import { SvgBriefcase as BriefcaseIcon } from '~/icons/Briefcase';
import { SvgCode as CodeIcon } from '~/icons/Code';
import { SvgFile as FileIcon } from '~/icons/File';
import { SvgFileText as FileTextIcon } from '~/icons/FileText';
import { SvgHeadphone as HeadphoneIcon } from '~/icons/Headphone';
import { downloadIdbBackup, uploadIdbBackup } from '~/lib/indexedDB';
import { selectMe, updateIsolationMode } from '~/state/me/meSlice';
import BaseLayout from '~/templates';

const Contents = styled.div``;

const LeftGroup = styled.div`
  width: 80%;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(props) =>
    `${props.theme.space[3]}px ${props.theme.space[5]}px ${props.theme.space[6]}px`};
  border-bottom: ${(props) => props.theme.border.grayLight.light};
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const BackupSection = styled.div`
  width: 100%;
  padding: ${(props) =>
    `${props.theme.space[3]}px ${props.theme.space[5]}px ${props.theme.space[6]}px`};
`;

const Subtitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  margin-bottom: ${(props) => props.theme.space[2]}px;
`;

const BackupButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 ${(props) => `${props.theme.space[2]}px ${props.theme.space[6]}px`};
  border-bottom: ${(props) => props.theme.border.grayLight.light};
`;

const Description = styled.p`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
`;

const Button = styled(BaseButton)`
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  width: 172px;
`;

const Links = styled.div``;

const Link = styled(BaseLink)``;

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
    <BaseLayout
      title="Settings"
      description={'Manage your account'}
      backTo="/profile"
    >
      <Contents>
        <Section>
          <LeftGroup>
            <Subtitle>{t('settings:Dark Mode')}</Subtitle>
            <Description>
              {t('settings:Change your app into dark theame')}
            </Description>
          </LeftGroup>
          <ToggleSwitch
            checked={me.settings.isIsolation}
            onChange={handleChangeIsolation}
          />
        </Section>

        <Section>
          <LeftGroup>
            <Subtitle>{t('settings:Isolation Mode')}</Subtitle>
            <Description>
              {t(
                'settings:If this mode is enabled, You can use communication functions only. This app will be isolated from everything outside the services, even like our Liber Search.'
              )}
            </Description>
          </LeftGroup>
          <ToggleSwitch
            checked={me.settings.isIsolation}
            onChange={handleChangeIsolation}
          />
        </Section>

        <BackupSection>
          <Subtitle>{t('settings:Backup')}</Subtitle>
          <Description>Import and Export your data to backup</Description>
        </BackupSection>
        <BackupButtons>
          <Button
            text={t('settings:DOWNLOAD BACKUP')}
            onClick={handleExportBackup}
            shape="rounded"
            variant="solid"
          />

          <Button
            text={t('settings:IMPORT BACKUP')}
            onClick={handleImportBackup}
            shape="rounded"
            variant="outline"
          />
        </BackupButtons>

        <Menu>
          <MenuTitle>Others</MenuTitle>
          <MenuItem to="/privacy" icon={FileIcon}>
            {t('common:Privacy Policy')}
          </MenuItem>
          <MenuItem to="/terms" icon={FileTextIcon}>
            {t('common:Terms of Service')}
          </MenuItem>
          <MenuItem to="/license" icon={BriefcaseIcon}>
            {t('common:License')}
          </MenuItem>
          <MenuItem to="/source_code" icon={CodeIcon}>
            {t('common:Source Code')}
          </MenuItem>
          <MenuItem to="/contact" icon={HeadphoneIcon}>
            {t('common:Contact Us')}
          </MenuItem>
        </Menu>
      </Contents>
    </BaseLayout>
  );
});

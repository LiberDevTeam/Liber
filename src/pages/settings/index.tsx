import React, { useState } from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import BackupIcon from '@material-ui/icons/Backup';
import { Button } from '~/components/atoms/button';
import { PageTitle } from '~/components/atoms/page-title';
import { ToggleSwitch } from '~/components/atoms/toggle-switch';
import BaseLayout from '~/templates';
import { TextFormWithSubmit } from '~/components/molecules/textform-with-submit';
import { SettingSection } from '~/components/organisms/setting-section';
import { LinkList } from '~/components/molecules/link-list';

export const SettingsPage: React.FC = () => {
  const [isIsolation, setIsIsolation] = useState(true);
  const linkList = [
    {
      text: 'Privacy Poilcy',
      path: '',
    },
    {
      text: 'Terms of Service',
      path: '',
    },
    {
      text: 'License',
      path: '',
    },
    {
      text: 'Contact Us',
      path: '',
    },
  ];

  return (
    <BaseLayout>
      <PageTitle>Settings</PageTitle>

      <SettingSection title="Username">
        <TextFormWithSubmit
          buttonName="Update"
          onSubmit={(text) => console.log(text)}
        />
      </SettingSection>

      <SettingSection title="Backup">
        <Button
          shape="square"
          text="Download backup"
          variant="solid"
          icon={<CloudDownloadIcon />}
        />
        <Button
          shape="square"
          text="Import backup"
          variant="outline"
          icon={<BackupIcon />}
        />
      </SettingSection>

      <SettingSection
        title="Isolation mode"
        description="If this mode is enabled, the application is isolated from everything of the Liber Search functionality."
      >
        <ToggleSwitch checked={isIsolation} onChange={setIsIsolation} />
      </SettingSection>

      <SettingSection title="">
        <LinkList linkList={linkList} />
      </SettingSection>
    </BaseLayout>
  );
};

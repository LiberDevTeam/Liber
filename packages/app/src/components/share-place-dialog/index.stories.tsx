import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { SharePlaceDialog, SharePlaceDialogProps } from '.';

export default {
  component: SharePlaceDialog,
  title: 'molecules/SharePlaceDialog',
  argTypes: {
    onClose: {
      action: 'onClose',
    },
  },
};

const Template: Story<SharePlaceDialogProps> = (args) => (
  <SharePlaceDialog {...args} />
);
export const Default = Template.bind({});
Default.args = {
  open: true,
  url: 'https://liber.live/places/55BD223E-3816-4D76-8409-2',
};

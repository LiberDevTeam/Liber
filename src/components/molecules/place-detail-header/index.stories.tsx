import React from 'react';
import { PlaceDetailHeader, PlaceDetailHeaderProps } from './';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: PlaceDetailHeader,
  title: 'molecules/PlaceDetailHeader',
  argTypes: {
    onInviteClick: {
      action: 'onInviteClick',
    },
  },
};

const Template: Story<PlaceDetailHeaderProps> = (args) => (
  <PlaceDetailHeader {...args} />
);
export const Default = Template.bind({});
Default.args = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  place: {
    avatarImage: '',
    id: '',
    name: 'We Love FC Barcelona!!',
    description:
      'DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescion',
  },
};

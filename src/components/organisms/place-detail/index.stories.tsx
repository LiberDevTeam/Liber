import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { PlaceDetail, PlaceDetailProps } from '.';

export default {
  component: PlaceDetail,
  title: 'organisms/PlaceDetail',
};

const Template: Story<PlaceDetailProps> = (args) => <PlaceDetail {...args} />;
export const Default = Template.bind({});

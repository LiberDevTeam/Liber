import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { PreviewImage, PreviewImageProps } from '.';
import LogoSVG from '../../logo.svg';

export default {
  component: PreviewImage,
  title: 'molecules/PreviewImage',
  argTypes: {
    onRemove: {
      action: 'onRemove',
    },
  },
};

const Template: Story<PreviewImageProps> = (args) => <PreviewImage {...args} />;
export const Default = Template.bind({});
Default.args = {
  src: LogoSVG,
};

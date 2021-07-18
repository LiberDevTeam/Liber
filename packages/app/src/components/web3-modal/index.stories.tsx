import { Story } from '@storybook/react/types-6-0';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import { getLibrary } from '~/lib/web3Provider';
import { Web3Modal, Web3ModalProps } from '.';

export default {
  component: Web3Modal,
  title: 'organisms/Web3Modal',
  argTypes: {
    onClose: {
      action: 'onClose',
    },
  },
};

const Template: Story<Web3ModalProps> = (args) => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3Modal {...args} />
  </Web3ReactProvider>
);
export const Default = Template.bind({});
Default.args = {
  open: true,
};

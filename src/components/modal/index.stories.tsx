import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import ReactModal from 'react-modal';
import { Modal, ModalProps } from '.';

ReactModal.setAppElement('#root');

export default {
  component: Modal,
  title: 'atoms/Modal',
  argTypes: {
    onClose: {
      action: 'onClose',
    },
    children: {
      control: false,
    },
  },
};

const Template: Story<ModalProps> = (args) => <Modal {...args} />;
export const Default = Template.bind({});
Default.args = {
  open: true,
  children: <div style={{ width: 572 }}>content</div>,
};

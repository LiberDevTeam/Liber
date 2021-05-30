import { Story } from '@storybook/react/types-6-0';
import { Web3Dialog, Web3DialogProps } from '.';

export default {
  component: Web3Dialog,
  title: 'components/Web3Dialog',
};

const Template: Story<Web3DialogProps> = (args) => <Web3Dialog {...args} />;
export const Default = Template.bind({});
Default.args = {};

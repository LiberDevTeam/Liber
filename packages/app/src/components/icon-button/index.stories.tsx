import { Story } from '@storybook/react/types-6-0';
import { SvgClose } from '~/icons/Close';
import { IconButton, IconButtonProps } from '.';

export default {
  component: IconButton,
  title: 'atoms/IconButton',
};

const Template: Story<IconButtonProps> = (args) => <IconButton {...args} />;
export const Default = Template.bind({});
Default.args = {
  icon: <SvgClose width={24} height={24} />,
};

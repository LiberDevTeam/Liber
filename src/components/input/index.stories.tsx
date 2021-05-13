import { Story } from '@storybook/react/types-6-0';
import { SvgSearch } from '~/icons/Search';
import { Input } from '.';

export default {
  component: Input,
  title: 'atoms/Input',
};

const Template: Story = (args) => <Input {...args} />;
export const Default = Template.bind({});
Default.args = {
  placeholder: 'Name',
};

export const Icon = Template.bind({});
Icon.args = {
  icon: <SvgSearch width={24} height={24} />,
  placeholder: 'Search',
};

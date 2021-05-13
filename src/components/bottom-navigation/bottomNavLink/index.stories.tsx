import { Story } from '@storybook/react/types-6-0';
import { SvgSearch } from '~/icons/Search';
import { BottomNavLink, BottomNavLinkProps } from '.';

export default {
  component: BottomNavLink,
  title: 'atoms/BottomNavLink',
};

const Template: Story<BottomNavLinkProps> = (args) => (
  <BottomNavLink {...args} />
);
export const Default = Template.bind({});
Default.args = {
  to: '/',
  icon: <SvgSearch width={24} height={24} />,
  children: 'Link',
};

import { Story } from '@storybook/react/types-6-0';
import { Mention } from '~/state/places/type';
import { UserMention } from './';

export default {
  component: UserMention,
  title: 'molecules/UserMention',
};

const Template: Story<Mention> = (args) => <UserMention {...args} />;
export const Default = Template.bind({});

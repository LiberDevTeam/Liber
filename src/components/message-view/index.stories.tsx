import { Story } from '@storybook/react/types-6-0';
import { MessageView, MessageViewProps } from '.';

export default {
  component: MessageView,
  title: 'MessageView',
};

const Template: Story<MessageViewProps> = (args) => <MessageView {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: 'id',
  uid: 'uid',
  text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.`,
  timestamp: 1612204980,
  mine: false,
  attachmentCidList: ['cid'],
};

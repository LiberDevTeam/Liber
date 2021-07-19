import { Story } from '@storybook/react/types-6-0';
import { SvgPeople } from '~/icons/People';
import { Button, ButtonProps } from '.';

export default {
  component: Button,
  title: 'atoms/Button',
  argTypes: {
    text: { control: 'text', defaultValue: 'Liber' },
    shape: {
      control: {
        type: 'select',
        options: ['square', 'rounded'],
      },
    },
    variant: {
      control: {
        type: 'select',
        options: ['solid', 'outline'],
      },
    },
    onClick: {
      action: 'onClick',
    },
  },
};

const Template: Story<ButtonProps> = (args) => <Button {...args} />;
export const Default = Template.bind({});
Default.args = { text: 'hello', shape: 'square', variant: 'solid' };

export const All: Story = (args) => (
  <>
    <Button
      shape="rounded"
      variant="outline"
      text={args.text}
      onClick={args.onClick}
    />
    <Button
      shape="rounded"
      variant="solid"
      text={args.text}
      onClick={args.onClick}
    />
    <Button
      shape="square"
      variant="outline"
      text={args.text}
      onClick={args.onClick}
    />
    <Button
      shape="square"
      variant="solid"
      text={args.text}
      onClick={args.onClick}
    />
    <Button
      icon={<SvgPeople />}
      shape="square"
      variant="solid"
      text={args.text}
      onClick={args.onClick}
    />
  </>
);

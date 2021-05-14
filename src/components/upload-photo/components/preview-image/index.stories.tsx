import { Story } from '@storybook/react/types-6-0';
import LogoSVG from '~/logo.svg';
import { PreviewImage, PreviewImageProps } from '.';

export default {
  component: PreviewImage,
  title: 'upload-photo/PreviewImage',
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

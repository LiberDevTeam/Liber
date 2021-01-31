import React from 'react';
import { PageTitle, PageTitleProps } from '.';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: PageTitle,
  title: 'atoms/PageTitle',
};

const Template: Story<PageTitleProps> = (args) => <PageTitle {...args} />;
export const Default = Template.bind({});
Default.args = {
  children: 'Hello',
};

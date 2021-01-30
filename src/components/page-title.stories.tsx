import React from 'react';
import { PageTitle, PageTitleProps } from './page-title';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: PageTitle,
  title: 'PageTitle',
};

const Template: Story<PageTitleProps> = (args) => <PageTitle {...args} />;
export const Default = Template.bind({});

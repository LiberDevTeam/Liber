---
name: 'component'
root: 'src/components/'
output: '**/*'
ignore: []
questions:
  name: 'Please enter the component name.'
---

# `{{ inputs.name }}.tsx`

```tsx
import React, { FC, memo } from 'react';

interface Props {}

export const {{ inputs.name | pascal }}: FC<Props> = memo(function {{ inputs.name | pascal }}({}) {
  return <div>Hello</div>;
});
```

# `{{ inputs.name }}.stories.tsx`

```tsx
import React from 'react';
import { {{ inputs.name | pascal }} } from './{{ inputs.name }}';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: {{ inputs.name | pascal }},
  title: '{{ inputs.name | pascal }}',
}

const Template = (args) => <{{ inputs.name | pascal }} {...args} />;
export const Default: Story = Template.bind({});
```

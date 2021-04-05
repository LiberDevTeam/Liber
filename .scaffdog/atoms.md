---
name: 'atoms'
root: 'src/components/'
output: '**/*'
ignore: []
questions:
  name: 'Please enter the component name.'
---

# `{{ inputs.name }}/index.tsx`

```tsx
import React from 'react';

export interface {{ inputs.name | pascal }}Props {}

export const {{ inputs.name | pascal }}: React.FC<{{ inputs.name | pascal }}Props> = React.memo(function {{ inputs.name | pascal }}({}) {
  return <div>Hello</div>;
});
```

# `{{ inputs.name }}/index.stories.tsx`

```tsx
import React from 'react';
import { {{ inputs.name | pascal }}, {{ inputs.name | pascal }}Props } from './';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: {{ inputs.name | pascal }},
  title: 'atoms/{{ inputs.name | pascal }}',
}

const Template: Story<{{ inputs.name | pascal }}Props> = (args) => <{{ inputs.name | pascal }} {...args} />;
export const Default = Template.bind({});
```

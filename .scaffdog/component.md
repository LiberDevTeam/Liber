---
name: 'component'
root: './src/components/'
output: '**/*'
ignore: []
questions:
  name: 'Please enter the component name.'
---

# `{{ inputs.name }}.tsx`

```tsx
import React, { FC, memo } from 'react';

interface Props {}

export const {{ inputs.name | camel }}: FC<Props> = memo(function {{ inputs.name | camel }}({}) {
  return <div>Hello</div>;
});
```

# `{{ inputs.name }}.stories.tsx`

```tsx
import React from './{{ inputs.name }}';

export default {
  component: {{ inputs.name | camel }},
  title: '{{ inputs.name | camel }}'
}

const Template = (args) => (<{{ inputs.name | camel }} {...args} />);
export const Default = Template.bind({});
```

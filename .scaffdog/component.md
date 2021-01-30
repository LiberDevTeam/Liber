---
name: 'component'
root: './src/components/'
output: '**/*'
ignore: []
questions:
  name: 'Please enter component name.'
---

# `{{ inputs.name}}.tsx`

```tsx
import React, { FC, memo } from 'react';

interface Props {}

export const {{ inputs.name | camel }}: FC<Props> = memo(function {{ inputs.name | camel }}({}) {
  return <div>Hello</div>;
});
```

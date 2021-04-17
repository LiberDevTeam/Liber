import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';

const Input = styled.input``;

interface Props {
  name: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const Checkbox: React.FC<Props> = React.memo(function Checkbox({
  name,
  checked,
  onChange,
}) {
  return (
    <Input name={name} type="checkbox" checked={checked} onChange={onChange} />
  );
});

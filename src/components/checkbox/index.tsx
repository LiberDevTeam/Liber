import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import { SvgCheckboxChecked } from '~/icons/CheckboxChecked';
import { SvgCheckboxUnchecked } from '~/icons/CheckboxUnchecked';

const Root = styled.div`
  width: 20px;
`;

const Input = styled.input`
  display: none;
`;

interface Props {
  name: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}

export const Checkbox: React.FC<Props> = React.memo(function Checkbox({
  name,
  checked,
  onChange,
  className,
}) {
  return (
    <Root className={className}>
      <Input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      {checked ? <SvgCheckboxChecked /> : <SvgCheckboxUnchecked />}
    </Root>
  );
});

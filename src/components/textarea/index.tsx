import React, { TextareaHTMLAttributes } from 'react';
import styled from 'styled-components';

export const BaseTextarea = styled.textarea`
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.md};
  background: ${(props) => props.theme.colors.bgGray};
  border: none;
  border-radius: ${(props) => props.theme.radii.large}px;
  padding: ${(props) => `${props.theme.space[4]}px ${props.theme.space[5]}px`};
  width: 100%;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.colors.lightPrimary} 0px 0px 0px 2px;
    outline: none;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.secondaryText};
  }
`;

const Root = styled.div`
  position: relative;
`;

const LengthIndicator = styled.span<{ exceed: boolean }>`
  position: absolute;
  bottom: ${(props) => props.theme.space[6]}px;
  right: 0;
  padding: ${(props) => `${props.theme.space[2]}px ${props.theme.space[3]}px`};
  color: ${(props) => props.theme.colors.secondaryText};
  ${(props) => props.exceed && `color: ${props.theme.colors.red};`}
`;

export const Textarea: React.FC<
  TextareaHTMLAttributes<HTMLTextAreaElement>
> = React.memo(function Textarea({ maxLength, value, ...rest }) {
  let length = 0;
  if (typeof value === 'string') {
    length = value.length;
  }

  return (
    <Root>
      <BaseTextarea value={value} {...rest} />
      {maxLength && (
        <LengthIndicator exceed={maxLength < length}>
          {length} / {maxLength}
        </LengthIndicator>
      )}
    </Root>
  );
});

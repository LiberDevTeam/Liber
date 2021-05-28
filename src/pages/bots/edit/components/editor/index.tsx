import React, { ChangeEventHandler, memo } from 'react';
import styled from 'styled-components';
import { Textarea } from '~/components/textarea';

const Description = styled.p`
  color: ${(props) => props.theme.colors.secondaryText};
  font-weight: ${(props) => props.theme.fontWeights.light};
`;

const StyledTextarea = styled(Textarea)`
  margin-top: ${(props) => props.theme.space[5]}px;
  margin-bottom: ${(props) => props.theme.space[15]}px;
  font-weight: ${(props) => props.theme.fontWeights.thin};
`;

interface Props {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  disabled?: boolean;
  errorMessage?: string;
}

export const Editor: React.FC<Props> = memo(function Editor({
  value,
  onChange,
  disabled,
  errorMessage,
}) {
  return (
    <>
      <Description>
        You could define the behavior of your bot written in Javascript. The bot
        will be executed in the sandbox environment. The bot cannot communicate
        with outside API, only supported to reply to users' messages currently.
      </Description>
      <StyledTextarea
        name="code"
        placeholder="Input the behavior of your bot"
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={8}
        maxLength={200}
        errorMessage={errorMessage}
      />
    </>
  );
});

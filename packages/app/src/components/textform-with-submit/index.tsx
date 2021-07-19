import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { Input } from '~/components/input';

const Form = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > * + * {
    margin-left: ${(props) => props.theme.space[4]}px;
  }
`;

export interface TextFormWithSubmitProps {
  onSubmit: (text: string) => void;
  buttonName?: string;
  placeHolder?: string;
  defaultText?: string;
}

export const TextFormWithSubmit: React.FC<TextFormWithSubmitProps> = ({
  onSubmit,
  buttonName = 'Submit',
  placeHolder = '',
  defaultText = '',
}) => {
  const [text, setText] = useState(defaultText);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(text);
  };

  return (
    <Form onSubmit={onSubmitHandler}>
      <Input
        name="textform"
        placeholder={placeHolder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        shape="rounded"
        text={buttonName}
        variant="outline"
        type="submit"
      />
    </Form>
  );
};

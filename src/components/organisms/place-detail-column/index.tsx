import { useFormik } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { Button } from '~/components/atoms/button';
import { Input } from '~/components/atoms/input';
import { MessageView } from '~/components/molecules/message-view';
import { Place } from '~/state/ducks/places/placesSlice';
import { Message } from '~/state/ducks/places/messagesSlice';

const Root = styled.div`
  display: flex;
  height: 100%;
  flex-flow: column;
  justify-content: space-between;
  overflow: hidden;
`;

const Header = styled.header``;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const Description = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  word-break: break-all;
  margin-top: ${(props) => props.theme.space[4]}px;
`;

const Messages = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  & > * {
    margin-top: ${(props) => props.theme.space[6]}px;
  }
`;

const Footer = styled.footer`
  display: flex;
  position: relative;
  bottom: 0;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.space[1]}px;
  padding-top: ${(props) => props.theme.space[5]}px;
`;

const Form = styled.form`
  display: contents;
`;

export interface FormValues {
  text: string;
}

export type PlaceDetailColumnProps = {
  place: Place;
  messages: Message[];
  onSubmit: (text: string) => void;
};

export const PlaceDetailColumn: React.FC<PlaceDetailColumnProps> = React.memo(
  function PlaceDetailColumn({ place, messages, onSubmit }) {
    const formik = useFormik<FormValues>({
      initialValues: {
        text: '',
      },
      async onSubmit({ text }) {
        onSubmit(text);
        formik.resetForm();
      },
    });

    return (
      <Root>
        <Header>
          <Title>{place.name}</Title>
          <Description>{place.description}</Description>
        </Header>

        <Messages>
          {messages.map((m) => (
            <MessageView
              key={m.id}
              authorId={m.authorId}
              timestamp={m.postedAt}
              text={m.text}
            />
          ))}
        </Messages>

        <Footer>
          <Form onSubmit={formik.handleSubmit}>
            <Input
              name="text"
              placeholder="Message..."
              value={formik.values.text}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
            <Button
              text="Send"
              shape="square"
              variant="solid"
              type="submit"
              disabled={formik.isSubmitting}
            />
          </Form>
        </Footer>
      </Root>
    );
  }
);

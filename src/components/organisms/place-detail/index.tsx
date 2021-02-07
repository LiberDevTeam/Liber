import { useFormik } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { Button } from '~/components/atoms/button';
import { Input } from '~/components/atoms/input';
import { MessageView } from '~/components/molecules/message-view';
import { Place, Message } from '~/state/ducks/place/placeSlice';

const Root = styled.div`
  display: grid;
  grid-template-rows: 80px 1fr 64px;
  overflow: hidden;
`;

const Header = styled.div``;
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
  & > * {
    margin-top: ${(props) => props.theme.space[6]}px;
  }
  overflow-y: auto;
`;

const Footer = styled.div`
  display: flex;
  padding: ${(props) => props.theme.space[1]}px;
  padding-top: ${(props) => props.theme.space[5]}px;
`;

export interface FormValues {
  text: string;
}

export type PlaceDetailProps = {
  place: Place;
  messages: Message[];
  onSubmit: (text: string) => void;
};

export const PlaceDetail: React.FC<PlaceDetailProps> = React.memo(
  function PlaceDetail({ place, messages, onSubmit }) {
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
              uid={m.uid}
              timestamp={m.timestamp}
              text={m.text}
            />
          ))}
        </Messages>

        <form onSubmit={formik.handleSubmit}>
          <Footer>
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
          </Footer>
        </form>
      </Root>
    );
  }
);

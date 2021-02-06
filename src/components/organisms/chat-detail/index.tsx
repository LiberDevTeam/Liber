import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Input } from '~/components/atoms/input';
import { selectChannelById, selectMe } from '~/state/ducks/me/meSlice';
import { Button } from '~/components/atoms/button';
import { useFormik } from 'formik';
import { broadcastMessage, rtcCreateOffer } from '../../../connection/actions';
import { v4 as uuidv4 } from 'uuid';
import { selectChannelMessages } from '~/state/ducks/channel/channelSlice';
import { MessageView } from '~/components/molecules/message-view';

export type ChatDetailProps = {
  cid: string;
};

const Root = styled.div`
  display: grid;
  grid-template-rows: 80px 1fr 64px;
  overflow: hidden;
`;

const Header = styled.div``;
const ChatTitle = styled.h2`
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

interface FormValues {
  text: string;
}

export const ChatDetail: React.FC<ChatDetailProps> = React.memo(
  function ChatPage({ cid }) {
    const chat = useSelector(selectChannelById(cid));
    const me = useSelector(selectMe);
    const messages = useSelector(selectChannelMessages(cid));
    const dispatch = useDispatch();
    const formik = useFormik<FormValues>({
      initialValues: {
        text: '',
      },
      async onSubmit({ text }) {
        await dispatch(
          broadcastMessage(cid, {
            id: uuidv4(),
            uid: me.id,
            text,
            timestamp: new Date().getTime(),
          })
        );
        formik.resetForm();
      },
    });

    useEffect(() => {
      dispatch(rtcCreateOffer(cid, me));
    }, [dispatch, cid, me]);

    if (!chat) {
      // TODO: Show error message
      return null;
    }

    return (
      <Root>
        <Header>
          <ChatTitle>{chat.name}</ChatTitle>
          <Description>{chat.description}</Description>
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

import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '~/hooks';
import { selectMe } from '~/state/me/meSlice';
import {
  selectMessageById,
  selectMessageReactionsByMessage,
} from '~/state/places/messagesSlice';
import { SystemMessage, SystemMessageType } from '~/state/places/type';
import { MessageTimestamp } from '../message-timestamp';
import { Reactions } from './reactions';
import { MessageViewProps } from './type';

const Root = styled.div`
  max-width: 80%;
  display: grid;
  grid-gap: ${(props) => props.theme.space[2]}px;
  grid-template-columns: auto;
  align-self: center;
`;

const Body = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: ${(props) => props.theme.space[2]}px;
  color: ${(props) => props.theme.colors.secondaryText};
  overflow-wrap: break-word;
  justify-self: end;
`;

const UserName = styled.span`
  color: ${(props) => props.theme.colors.primaryText};
`;

const StyledReactions = styled(Reactions)``;

// TODO: other system type view
export const SystemMessageView: React.FC<MessageViewProps> = ({
  id,
  onReactionClick,
}) => {
  const message = useAppSelector((state) =>
    selectMessageById(state.placeMessages, id)
  ) as SystemMessage | undefined;
  const me = useAppSelector(selectMe);
  const reactions = useAppSelector(selectMessageReactionsByMessage(message));

  if (!message) {
    return null;
  }

  switch (message.type) {
    case SystemMessageType.JOIN:
      return (
        <Root>
          <Body>
            <UserName>{message.id}</UserName>
            <span>is joined this place!</span>
            <MessageTimestamp timestamp={message.timestamp} />
          </Body>
          <StyledReactions
            id={message.id}
            myId={me.id}
            onClick={onReactionClick}
            reactions={reactions}
          />
        </Root>
      );
  }

  return null;
};

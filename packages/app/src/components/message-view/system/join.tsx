import React from 'react';
import styled from 'styled-components';
import { MessageTimestamp } from '~/components/message-timestamp';
import { useAppSelector } from '~/hooks';
import { selectMessageReactionsByMessage } from '~/state/places/messagesSlice';
import { UserJoinMessage } from '~/state/places/type';
import { selectUserById } from '~/state/users/usersSlice';
import { Reactions } from '../reactions';

const Root = styled.div`
  max-width: 80%;
  display: grid;
  grid-gap: ${(props) => props.theme.space[2]}px;
  grid-template-columns: auto;
  align-self: center;
`;

const Body = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: ${(props) => props.theme.space[1]}px;
  color: ${(props) => props.theme.colors.secondaryText};
  overflow-wrap: break-word;
  justify-self: end;
`;

const UserName = styled.span`
  color: ${(props) => props.theme.colors.primaryText};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  margin-right: ${(props) => props.theme.space[1]}px;
`;

const StyledReactions = styled(Reactions)``;

interface Props {
  message: UserJoinMessage;
  myId: string;
  onReactionClick: (props: { messageId: string; emojiId: string }) => void;
}
export const UserJoinMessageView: React.FC<Props> = ({
  message,
  myId,
  onReactionClick,
}) => {
  const user = useAppSelector((state) =>
    selectUserById(state.users, message.uid)
  );

  const reactions = useAppSelector(selectMessageReactionsByMessage(message));

  return (
    <Root>
      <Body>
        <div>
          <UserName>{user ? user.name : message.uid}</UserName>
          <span>is joined this place!</span>
        </div>
        <MessageTimestamp timestamp={message.timestamp} />
      </Body>
      <StyledReactions
        id={message.id}
        myId={myId}
        onClick={onReactionClick}
        reactions={reactions}
      />
    </Root>
  );
};

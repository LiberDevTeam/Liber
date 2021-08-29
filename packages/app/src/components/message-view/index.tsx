import React, { useCallback } from 'react';
import { BotMessageView } from '~/components/message-view/bot';
import { SystemMessageView } from '~/components/message-view/system';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { selectMe } from '~/state/me/meSlice';
import { addReaction } from '~/state/places/async-actions';
import { selectMessageById } from '~/state/places/messagesSlice';
import { isSystemMessage } from '~/state/places/utils';
import { MyMessageView } from './mine';
import { UserMessageView } from './user';

export interface MessageViewProps {
  id: string;
  placeId: string;
}

export const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({ placeId, id }) {
    const me = useAppSelector(selectMe);
    const message = useAppSelector((state) =>
      selectMessageById(state.placeMessages, id)
    );
    const dispatch = useAppDispatch();

    const handleReactionClick = useCallback(
      (props: { emojiId: string; messageId: string }) => {
        dispatch(
          addReaction({
            placeId,
            messageId: props.messageId,
            emojiId: props.emojiId,
          })
        );
      },
      [dispatch, placeId]
    );

    if (!message) {
      return null;
    }

    if (isSystemMessage(message)) {
      return (
        <SystemMessageView id={id} onReactionClick={handleReactionClick} />
      );
    }

    if (message.bot) {
      return <BotMessageView id={id} />;
    }

    const mine = message?.uid === me.id;

    if (mine) {
      return <MyMessageView id={id} onReactionClick={handleReactionClick} />;
    }

    return <UserMessageView id={id} onReactionClick={handleReactionClick} />;
  }
);

import React from 'react';
import { useAppSelector } from '~/hooks';
import { selectMe } from '~/state/me/meSlice';
import { selectMessageById } from '~/state/places/messagesSlice';
import { SystemMessage, SystemMessageType } from '~/state/places/type';
import { UserJoinMessageView } from './system/join';
import { MessageViewProps } from './type';

// TODO: other system type view
export const SystemMessageView: React.FC<MessageViewProps> = ({
  id,
  onReactionClick,
}) => {
  const message = useAppSelector((state) =>
    selectMessageById(state.placeMessages, id)
  ) as SystemMessage | undefined;
  const me = useAppSelector(selectMe);

  if (!message) {
    return null;
  }

  switch (message.type) {
    case SystemMessageType.JOIN:
      return (
        <UserJoinMessageView
          message={message}
          myId={me.id}
          onReactionClick={onReactionClick}
        />
      );
  }

  return null;
};

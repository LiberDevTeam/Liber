import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { UserAvatar } from '~/components/user-avatar';
import { setSelectedUser } from '~/state/selected-user';
import { RootState } from '~/state/store';
import { selectUserById, User } from '~/state/users/usersSlice';
import { Message } from '../message';

const Root = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
`;

const UserName = styled.span`
  display: flex;
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  height: ${(props) => props.theme.space[7]}px;
  align-items: center;
  margin-bottom: ${(props) => props.theme.space[2]}px;
`;

const Body = styled.div`
  padding-left: ${(props) => props.theme.space[2]}px;
`;

const Attachment = styled(IpfsContent)`
  margin-top: ${(props) => props.theme.space[2]}px;
  max-height: 100px;
  width: auto;
`;

export interface MessageViewProps {
  id: string;
  uid: string;
  timestamp: number;
  text?: string;
  attachmentCidList?: string[];
  mine: boolean;
}

export const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({ id, uid, timestamp, text, attachmentCidList, mine }) {
    const dispatch = useDispatch();

    const user = useSelector<RootState, User | undefined>(
      (state) => selectUserById(state.users, uid),
      shallowEqual
    );

    const handleClickUser = useCallback(() => {
      if (user?.id) {
        dispatch(setSelectedUser(user.id));
      }
    }, [user?.id, dispatch]);

    return (
      <Root mine={mine}>
        <div onClick={handleClickUser}>
          <UserAvatar userId={uid} />
        </div>
        <Body>
          {mine ? null : <UserName>{user?.username || 'Loading'}</UserName>}
          {text && <Message mine={mine} text={text} timestamp={timestamp} />}
          {attachmentCidList
            ? attachmentCidList.map((cid) => (
                <Attachment key={`${id}-${cid}`} cid={cid} />
              ))
            : null}
        </Body>
      </Root>
    );
  }
);

import { fromUnixTime } from 'date-fns';
import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { UserAvatar } from '~/components/user-avatar';
import { formatTime, formatTimeStrict } from '~/helpers/time';
import { setSelectedUser } from '~/state/ducks/selected-user';
import { selectUserById, User } from '~/state/ducks/users/usersSlice';
import { RootState } from '~/state/store';

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

const Timestamp = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs};
  line-height: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-top: ${(props) => props.theme.space[2]}px;
`;

const Body = styled.div`
  padding-left: ${(props) => props.theme.space[2]}px;
`;

const Text = styled.div<{ mine: boolean }>`
  padding: ${(props) => `${props.theme.space[2]}px ${props.theme.space[3]}px`};
  border-radius: ${(props) =>
    props.mine
      ? `${props.theme.space[2]}px ${props.theme.space[2]}px 0px ${props.theme.space[2]}px`
      : `0 ${props.theme.space[2]}px ${props.theme.space[2]}px ${props.theme.space[2]}px`};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.md};
  line-height: ${(props) => props.theme.fontSizes['2xl']};
  color: ${(props) => props.theme.colors.primaryText};
  display: flex;
  flex-direction: column;
  background: ${(props) =>
    props.mine ? props.theme.colors.bgGray : props.theme.colors.bgBlue};
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
    const time = fromUnixTime(timestamp);
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
          <Text mine={mine}>
            {text}
            <Timestamp title={formatTimeStrict(time)}>
              {formatTime(time)}
            </Timestamp>
          </Text>
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

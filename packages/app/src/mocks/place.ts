import { getUnixTime } from 'date-fns';
import { Place } from '~/state/places/type';

export const dummyPlace = (id: string): Place => ({
  id,
  name: 'We Love FC Barcelona!!',
  avatarCid: `QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ`,
  description:
    'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
  timestamp: getUnixTime(new Date()),
  createdAt: 0,
  messageIds: [],
  unreadMessages: [],
  feedAddress: '',
  keyValAddress: '',
  passwordRequired: false,
  category: 0,
  hash: null,
  swarmKey: null,
  permissions: {},
  bannedUsers: [],
  readOnly: false,
  bots: [],
  reactions: {},
});

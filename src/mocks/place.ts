import { getUnixTime } from 'date-fns';
import { Place } from '../state/ducks/places/placesSlice';

export const dummyPlace = (id: string): Place => ({
  id,
  name: 'We Love FC Barcelona!!',
  avatarImage: `https://i.pravatar.cc/60?u=${id}`,
  description:
    'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
  invitationUrl: `https://liber.live`,
  timestamp: getUnixTime(new Date()),
  avatarImageCID: '',
  createdAt: 0,
  messageIds: [],
  unreadMessages: [],
  feedAddress: '',
  keyValAddress: '',
});

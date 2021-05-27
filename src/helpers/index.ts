import { User } from '~/state/users/usersSlice';

export const username = (user: User) =>
  user.username ? user.username : 'Anonymous';
export const shortenUid = (user: User) => user.id.substr(0, 8);

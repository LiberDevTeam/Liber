import { User } from '~/state/users/type';

export const username = (user: User) =>
  user.username ? user.username : 'Unnamed';
export const shortenUid = (user: User) => user.id.substr(0, 8);
export const invitationUrl = (placeId: string, address: string) =>
  `${window.location.protocol}//${window.location.host}/#/places/${address}/${placeId}`;

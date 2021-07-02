import { User } from '~/state/users/type';

export const omitText = (text: string, length: number) =>
  text.slice(0, length) + '...';
export const username = (user: User): string =>
  user.name ? user.name : 'Unnamed';
export const shortenUid = (user: User): string => user.id.substr(0, 8);
export const invitationUrl = (placeId: string, address: string): string =>
  `${window.location.protocol}//${window.location.host}/#/places/${address}/${placeId}`;

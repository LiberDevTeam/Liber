import { User } from '~/state/users/type';

export const dummyUser = (id: string): User => ({
  id,
  name: 'user-name',
  botsListingOn: [],
  stickersListingOn: [],
});

import { User } from '~/state/users/type';

export const dummyUser = (id: string, name?: string): User => ({
  id,
  name: name ?? 'user-name',
  botsListingOn: [],
  stickersListingOn: [],
});

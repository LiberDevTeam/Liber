import { User } from '~/state/users/type';

export const dummyUser = (id: string): User => ({
  id,
  botsListingOn: [],
  stickersListingOn: [],
});

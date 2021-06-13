export interface User {
  id: string;
  username?: string;
  avatarCid?: string;
  botsListingOn: string[];
  stickersListingOn: string[];
}

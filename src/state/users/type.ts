import { BotPK, StickerPK } from '../me/type';

export interface User {
  id: string;
  username?: string;
  avatarCid?: string;
  botsListingOn: BotPK[];
  stickersListingOn: StickerPK[];
}

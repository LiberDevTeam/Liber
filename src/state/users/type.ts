import { BotPK, StickerPK } from '../me/type';

export interface User {
  id: string;
  name?: string;
  avatarCid?: string;
  botsListingOn: BotPK[];
  stickersListingOn: StickerPK[];
}

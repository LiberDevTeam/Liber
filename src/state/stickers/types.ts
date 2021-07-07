export interface Sticker {
  id: string;
  uid: string;
  keyValAddress: string;
  created: number;
  category: number;
  name: string;
  description: string;
  price: number;
  contents: Content[];
  purchased?: boolean; // means the current user purchased the sticker.
}

export type StickerPartialForUpdate = Omit<
  Sticker,
  // These are the fields that cannot be updated.
  'id' | 'uid' | 'keyValAddress' | 'created' | 'purchased'
>;

export interface Content {
  cid: string;
}

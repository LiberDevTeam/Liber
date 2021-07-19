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
  qtySold: number;
}

export type StickerPartialForUpdate = Omit<
  Sticker,
  // These are the fields that cannot be updated.
  'id' | 'uid' | 'keyValAddress' | 'created' | 'qtySold'
>;

export interface Content {
  cid: string;
}

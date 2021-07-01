import MiniSearch from 'minisearch';
import { Bot } from '~/state/bots/botsSlice';
import { Sticker } from '~/state/stickers/stickersSlice';

export let marketplaceBotSearch: MiniSearch,
  marketplaceStickerSearch: MiniSearch;

export const createMarketplaceBotSearchIndex = (bots: Bot[]) => {
  marketplaceBotSearch = new MiniSearch({
    fields: ['category', 'name', 'description', 'price', 'readme', 'created'],
    storeFields: [
      'id',
      'uid',
      'avatar',
      'keyValAddress',
      'category',
      'name',
      'description',
      'price',
      'readme',
      'created',
    ],
    // TODO tuning
    // tokenize?: (text: string, fieldName?: string) => string[];
    // processTerm?: (term: string, fieldName?: string) => string | null | undefined | false;
  });
  marketplaceBotSearch.addAllAsync(bots);
};

export const createMarketplaceStickerSearchIndex = (stickers: Sticker[]) => {
  marketplaceStickerSearch = new MiniSearch({
    fields: [
      'id',
      'uid',
      'category',
      'name',
      'description',
      'price',
      'created',
    ],
    storeFields: [
      'id',
      'uid',
      'keyValAddress',
      'category',
      'name',
      'description',
      'price',
      'contents',
      'created',
    ],
    // TODO tuning
    // tokenize?: (text: string, fieldName?: string) => string[];
    // processTerm?: (term: string, fieldName?: string) => string | null | undefined | false;
  });
  marketplaceStickerSearch.addAllAsync(stickers);
};

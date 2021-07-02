import MiniSearch from 'minisearch';
import { Bot } from '~/state/bots/botsSlice';
import { Message, Place } from '~/state/places/type';
import { Sticker } from '~/state/stickers/stickersSlice';

export let marketplaceBotSearch: MiniSearch,
  marketplaceStickerSearch: MiniSearch,
  explorePlaceSearch: MiniSearch,
  exploreMessageSearch: MiniSearch;

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

export const createExplorePlaceSearchIndex = (places: Place[]) => {
  explorePlaceSearch = new MiniSearch({
    fields: ['name', 'description', 'avatarCid', 'category', 'createdAt'],
    storeFields: [
      'name',
      'description',
      'avatarCid',
      'category',
      'createdAt',
      'id',
      'timestamp',
      'messageIds',
      'unreadMessages',
      'permissions',
      'feedAddress',
      'keyValAddress',
      'bannedUsers',
      'bots',
      'readOnly',
      'swarmKey',
      'passwordRequired',
    ],
    // TODO tuning
    // tokenize?: (text: string, fieldName?: string) => string[];
    // processTerm?: (term: string, fieldName?: string) => string | null | undefined | false;
  });
  explorePlaceSearch.addAllAsync(places);
};

export const createExploreMessageSearchIndex = (messages: Message[]) => {
  exploreMessageSearch = new MiniSearch({
    fields: ['authorName', 'timestamp', 'text', 'mentions'],
    storeFields: [
      'id',
      'uid',
      'authorName',
      'timestamp',
      'text',
      'attachmentCidList?',
      'content',
      'mentions',
      'bot',
    ],
    // TODO tuning
    // tokenize?: (text: string, fieldName?: string) => string[];
    // processTerm?: (term: string, fieldName?: string) => string | null | undefined | false;
  });
  exploreMessageSearch.addAllAsync(messages);
};

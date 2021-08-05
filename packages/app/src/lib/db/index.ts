import { connectBotKeyValue, createBotKeyValue, readBotFromDB } from './bot';
import {
  connectExploreMessageKeyValue,
  readExploreMessageFromDB,
} from './explore/message';
import {
  connectExplorePlaceKeyValue,
  readExplorePlaceFromDB,
} from './explore/place';
import { connectFeedDB, readFeedFromDB } from './feed';
import {
  connectMarketplaceBotNewKeyValue,
  readMarketplaceBotNewFromDB,
} from './marketplace/bot/new';
import {
  connectMarketplaceBotRankingKeyValue,
  readMarketplaceBotRankingFromDB,
} from './marketplace/bot/ranking';
import {
  connectMarketplaceStickerNewKeyValue,
  readMarketplaceStickerNewFromDB,
} from './marketplace/sticker/new';
import {
  connectMarketplaceStickerRankingKeyValue,
  readMarketplaceStickerRankingFromDB,
} from './marketplace/sticker/ranking';
import {
  connectMessageFeed,
  createMessageFeed,
  getMessageFeedById,
  readMessagesFromFeed,
} from './message';
import {
  connectPlaceKeyValue,
  createPlaceKeyValue,
  getPlaceDB,
  readPlaceFromDB,
} from './place';
import { connectPrivateFieldsDB, createPrivateFieldsDB } from './privateFields';
import {
  connectStickerKeyValue,
  createStickerKeyValue,
  readStickerFromDB,
} from './sticker';
import { connectUserDB, createUserDB } from './user';

export const appDB = {
  place: {
    connect: connectPlaceKeyValue,
    read: readPlaceFromDB,
    create: createPlaceKeyValue,
    get: getPlaceDB,
  },
  message: {
    connect: connectMessageFeed,
    read: readMessagesFromFeed,
    get: getMessageFeedById,
    create: createMessageFeed,
  },
  explorePlace: {
    connect: connectExplorePlaceKeyValue,
    read: readExplorePlaceFromDB,
  },
  exploreMessage: {
    connect: connectExploreMessageKeyValue,
    read: readExploreMessageFromDB,
  },
  feed: {
    connect: connectFeedDB,
    read: readFeedFromDB,
  },
  user: { connect: connectUserDB, create: createUserDB },
  bot: {
    connect: connectBotKeyValue,
    read: readBotFromDB,
    create: createBotKeyValue,
  },
  sticker: {
    connect: connectStickerKeyValue,
    create: createStickerKeyValue,
    read: readStickerFromDB,
  },
  marketplaceBotNew: {
    connect: connectMarketplaceBotNewKeyValue,
    read: readMarketplaceBotNewFromDB,
  },
  marketplaceBotRanking: {
    connect: connectMarketplaceBotRankingKeyValue,
    read: readMarketplaceBotRankingFromDB,
  },
  marketplaceStickerNew: {
    connect: connectMarketplaceStickerNewKeyValue,
    read: readMarketplaceStickerNewFromDB,
  },
  marketplaceStickerRanking: {
    connect: connectMarketplaceStickerRankingKeyValue,
    read: readMarketplaceStickerRankingFromDB,
  },
  privateFields: {
    connect: connectPrivateFieldsDB,
    create: createPrivateFieldsDB,
  },
};

export type AppDB = typeof appDB;

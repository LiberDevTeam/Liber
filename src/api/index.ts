const HOST = '';

const call = (url: string) => fetch(url, { mode: 'cors' });

export const marketplaceSearchBots = (query: string, page: number) =>
  call(
    `${HOST}/v1/marketplace/bots/search?query=${encodeURIComponent(
      query
    )}&page=${page}`
  );

export const marketplaceNewBots = (page: number) =>
  call(`${HOST}/v1/marketplace/bots/new?page=${page}`);

export const marketplaceRankingBots = (page: number) =>
  call(`${HOST}/v1/marketplace/bots/ranking?page=${page}`);

export const marketplaceSearchStickers = (query: string, page: number) =>
  call(
    `${HOST}/v1/marketplace/stickers/search?query=${encodeURIComponent(
      query
    )}&page=${page}`
  );

export const marketplaceNewStickers = (page: number) =>
  call(`${HOST}/v1/marketplace/stickers/new?page=${page}`);

export const marketplaceRankingStickers = (page: number) =>
  call(`${HOST}/v1/marketplace/stickers/ranking?page=${page}`);

const HOST = 'localhost:8080';

// export const searchMarketplaceBots = (query: string, page: number) => fetch(encodeURIComponent(`${HOST}/v1/search/marketplace/bots?query=${query}&page=${page}`));
export const searchMarketplaceBots = (query: string, page: number) =>
  fetch(
    encodeURIComponent(
      `${HOST}/v1/search/marketplace/bots?query=${query}&page=${page}`
    )
  );

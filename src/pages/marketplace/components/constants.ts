export enum MarketplaceKind {
  Bots = 'bots',
  Stickers = 'stickers',
}

export enum MarketplaceTabPanel {
  Ranking = 'ranking',
  New = 'new',
}

export const TAB_TITLE = {
  [MarketplaceTabPanel.Ranking]: 'Ranking',
  [MarketplaceTabPanel.New]: 'New',
};

import MiniSearch from 'minisearch';
import { Bot } from '~/state/bots/botsSlice';

export let marketplaceBotSearch: MiniSearch;

export const createSearchIndex = ({ bots }: { bots: Bot[] }) => {
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

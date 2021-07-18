import { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US';
import ja from 'date-fns/locale/ja';
import { useTranslation } from 'react-i18next';

export const useFnsLocale = (): Locale => {
  const {
    i18n: { language },
  } = useTranslation();
  switch (language) {
    case 'en':
      return en;
    case 'ja':
      return ja;
    default:
      return en;
  }
};

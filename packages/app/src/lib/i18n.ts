import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18next
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    ns: ['common', 'newPlaces', 'settings', 'selectOptions', 'chat'],
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      // TODO: re-enable after implemented to use suspense.
      useSuspense: false,
    },
  });

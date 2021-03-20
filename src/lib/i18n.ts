import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18next
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    ns: ['common', 'nav', 'newPlaces', 'settings'],
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

// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import englishTranslations from "./locales/en/translation.json";
import ukrainianTranslations from "./locales/uk/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: englishTranslations,
      },
      uk: {
        translation: ukrainianTranslations,
      },
    },
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

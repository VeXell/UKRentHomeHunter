import TelegrafI18n from 'telegraf-i18n';
import enLocale from './locales/en';
import ruLocale from './locales/ru';

const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    useSession: true,
    defaultLanguageOnMissing: true,
});

i18n.loadLocale('en', enLocale);
i18n.loadLocale('ru', ruLocale);

export default i18n;

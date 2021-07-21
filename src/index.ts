import './env';
import { Telegraf, session } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
import { TelegrafContext } from 'types';
import { DATABASE, FIREBASE_AUTH, BOT_TOKEN } from 'config';

import enLocale from './locales/en';
import ruLocale from './locales/ru';

import { initActions } from 'actions';
import { initWizards } from 'wizards';
import { initJobs } from 'jobs';
import { initDatabase } from 'services/db';

initDatabase(FIREBASE_AUTH, DATABASE);

const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    useSession: true,
    defaultLanguageOnMissing: true,
});

i18n.loadLocale('en', enLocale);
i18n.loadLocale('ru', ruLocale);

const bot = new Telegraf<TelegrafContext>(BOT_TOKEN);

bot.use(session());
bot.use(i18n.middleware());

initWizards(bot);
initActions(bot);

// Start bot
bot.launch();
initJobs(bot);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
process.on('unhandledRejection', (error) => {
    console.error(error);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.log(error);
    process.exit(1);
});

console.log('Bot Started');

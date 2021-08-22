import './env';
import { Telegraf, session } from 'telegraf';
import i18n from 'i18n';
import { TelegrafContext } from 'types';
import { DATABASE, FIREBASE_AUTH, BOT_TOKEN } from 'config';

import { initActions } from 'actions';
import { initWizards } from 'wizards';
import { initJobs } from 'jobs';
import { initDatabase } from 'services/db';

initDatabase(FIREBASE_AUTH, DATABASE);

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

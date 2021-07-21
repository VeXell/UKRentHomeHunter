import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'types';

import initJobDailySearch from './search';
import initRemoveExpiredSearches from './remove-expired';
import initSendResults from './send-search-results';

export async function initJobs(bot: Telegraf<TelegrafContext>) {
    initJobDailySearch();
    initRemoveExpiredSearches();
    initSendResults(bot);
}

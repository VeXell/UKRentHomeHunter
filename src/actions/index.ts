import { Telegraf } from 'telegraf';
import { TelegrafContext, GLOBAL_ACTIONS } from 'types';

import actionStart from './start';
import actionHelp from './help';
import actionSearch from './search';
import actionSearches from './searches';
import actionShare from './share';
import actionRemove from './remove';

export function initActions(bot: Telegraf<TelegrafContext>) {
    bot.start(actionStart);
    bot.help(actionHelp);
    bot.settings(async (ctx) => {
        await ctx.setMyCommands([
            {
                command: GLOBAL_ACTIONS.search,
                description: ctx.i18n.t(`actions.${GLOBAL_ACTIONS.search}`),
            },
            {
                command: GLOBAL_ACTIONS.searches,
                description: ctx.i18n.t(`actions.${GLOBAL_ACTIONS.searches}`),
            },
            {
                command: GLOBAL_ACTIONS.share,
                description: ctx.i18n.t(`actions.${GLOBAL_ACTIONS.share}`),
            },
        ]);
    });

    bot.command(GLOBAL_ACTIONS.search, actionSearch);
    bot.command(GLOBAL_ACTIONS.share, actionShare);
    bot.command(GLOBAL_ACTIONS.searches, actionSearches);

    bot.action(GLOBAL_ACTIONS.search, actionSearch);
    bot.action(GLOBAL_ACTIONS.share, actionShare);
    bot.action(GLOBAL_ACTIONS.searches, actionSearches);
    bot.action(new RegExp(`${GLOBAL_ACTIONS.remove}_(?<id>.*)?$`), actionRemove);
}

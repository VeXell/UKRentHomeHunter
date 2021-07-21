import { TelegrafContext, GLOBAL_ACTIONS } from 'types';
import { Markup } from 'telegraf';
import { getSearches } from 'services/db/search';
import { getOpenSearchUrl } from 'processing/zoopla/url';
import { distanceToText } from 'utils';

export default async function searchesAction(ctx: TelegrafContext) {
    const chatId = ctx.from?.id;

    if (!chatId) {
        return ctx.replyWithMarkdown(ctx.i18n.t('error.emptyChatId'), Markup.removeKeyboard());
    }

    const activeSearches = await getSearches(chatId);
    ctx.session.activeSearches = activeSearches;

    if (activeSearches && Object.keys(activeSearches).length) {
        const activeSearchesCount = Object.keys(activeSearches).length;

        if (activeSearchesCount === 1) {
            await ctx.replyWithMarkdown(
                ctx.i18n.t('searches.activeSearchesOne'),
                Markup.removeKeyboard()
            );
        } else {
            await ctx.replyWithMarkdown(
                ctx.i18n.t('searches.activeSearches', {
                    count: activeSearchesCount,
                }),
                Markup.removeKeyboard()
            );
        }

        const keys = Object.keys(activeSearches);
        let index = 0;

        for (const key of keys) {
            const data = activeSearches[key];

            let rooms;

            if (data.rooms === 'studio') {
                rooms = ctx.i18n.t('studio');
            } else {
                rooms = ctx.i18n.t('bedroom', { rooms: data.rooms });
            }

            let searchText = ctx.i18n.t('searchEntry', {
                budget: data.budget,
                area: data.area,
                rooms,
                plus: data.roomsMore ? '+' : '',
                distance: distanceToText(data.distance),
            });

            switch (index) {
                case 0:
                    searchText = `1️⃣ ${searchText}`;
                    break;
                case 1:
                    searchText = `2️⃣ ${searchText}`;
                    break;
                case 2:
                    searchText = `3️⃣ ${searchText}`;
                    break;
            }

            const openUrl = getOpenSearchUrl(data, '14_days');

            await ctx.replyWithMarkdown(
                ctx.i18n.t(searchText),
                Markup.inlineKeyboard([
                    Markup.button.url('🔍 Open results', openUrl),
                    Markup.button.callback('❌ Remove search', `${GLOBAL_ACTIONS.remove}_${key}`),
                ])
            );

            index++;
        }

        // eslint-disable-next-line no-useless-return
        return;
    } else {
        return ctx.replyWithMarkdown(
            ctx.i18n.t('searches.noActiveSearches'),
            Markup.removeKeyboard()
        );
    }
}

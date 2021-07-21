import { TelegrafContext, GLOBAL_ACTIONS } from 'types';
import { Markup } from 'telegraf';
import { MAX_SEARCHES } from 'config';
import { SEARCH_WIZARD_TYPE } from 'wizards';
import { updateChat } from 'services/db/chats';
import { getSearches } from 'services/db/search';

export default async function searchAction(ctx: TelegrafContext) {
    const message = ctx.i18n.t('wizardSearch.intro');
    const chatId = ctx.from?.id;

    if (chatId) {
        // Save new chat to database
        updateChat(chatId, {
            firstName: ctx.from?.first_name || '',
            lastName: ctx.from?.last_name || '',
            username: ctx.from?.username || '',
            language: ctx.from?.language_code || '',
        });

        try {
            const activeSearches = await getSearches(chatId);
            ctx.session.activeSearches = activeSearches;

            if (activeSearches && Object.keys(activeSearches).length >= MAX_SEARCHES) {
                // Do not allow more searches
                return ctx.replyWithMarkdown(
                    ctx.i18n.t('error.maxSearchesReached', {
                        maxSearches: MAX_SEARCHES,
                    }),
                    Markup.inlineKeyboard([
                        Markup.button.callback('📝 My Searches', GLOBAL_ACTIONS.searches),
                    ])
                );
            } else {
                await ctx.replyWithMarkdown(message, Markup.removeKeyboard());

                // Enter to wizard
                return ctx.scene.enter(SEARCH_WIZARD_TYPE);
            }
        } catch (error) {
            console.log('error');
        }
    } else {
        return ctx.replyWithMarkdown(ctx.i18n.t('error.emptyChatId'), Markup.removeKeyboard());
    }
}

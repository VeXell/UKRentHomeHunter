import { TelegrafContext } from 'types';
import { Markup } from 'telegraf';
import { getSearches, removeSearch } from 'services/db/search';
import { removeSearchResults } from 'services/db/search-results';

export default async function removeAction(ctx: TelegrafContext & { match: RegExpExecArray }) {
    const chatId = ctx.from?.id;

    if (!chatId) {
        return ctx.replyWithMarkdown(ctx.i18n.t('error.emptyChatId'), Markup.removeKeyboard());
    }

    if (!Array.isArray(ctx.match) || !ctx.match.length || !ctx.match.groups?.id) {
        return ctx.replyWithMarkdown(ctx.i18n.t('error.incorrectEntered'), Markup.removeKeyboard());
    }

    const activeSearches = await getSearches(chatId);
    ctx.session.activeSearches = activeSearches;

    const removeSearchId = ctx.match.groups.id;

    if (activeSearches && Object.keys(activeSearches).length) {
        let area = '';
        let removeDBIndex = '';

        Object.keys(activeSearches).forEach((key) => {
            const data = activeSearches[key];

            if (key === removeSearchId) {
                area = data.area;
                removeDBIndex = key;
            }
        });

        if (removeDBIndex) {
            removeSearch(chatId, removeDBIndex);
            removeSearchResults(chatId, removeDBIndex);

            return ctx.replyWithMarkdown(
                ctx.i18n.t('searches.removedSearch', {
                    area,
                }),
                Markup.removeKeyboard()
            );
        } else {
            return ctx.replyWithMarkdown(
                ctx.i18n.t('error.searchToRemoveNotFound', {
                    index: removeSearchId,
                }),
                Markup.removeKeyboard()
            );
        }
    } else {
        return ctx.replyWithMarkdown(
            ctx.i18n.t('searches.noActiveSearches'),
            Markup.removeKeyboard()
        );
    }
}

import { TelegrafContext, GLOBAL_ACTIONS } from 'types';
import { Markup } from 'telegraf';
import { addChat } from 'services/db/chats';

export default function startAction(ctx: TelegrafContext) {
    const message = ctx.i18n.t('greeting', {
        name: ctx.from?.first_name || ctx.from?.username,
    });

    const chatId = ctx.from?.id;

    if (chatId) {
        addChat(chatId, {
            firstName: ctx.from?.first_name || '',
            lastName: ctx.from?.last_name || '',
            username: ctx.from?.username || '',
            language: ctx.from?.language_code || '',
        });
    }

    return ctx.replyWithMarkdown(
        message,
        Markup.inlineKeyboard(
            [
                Markup.button.callback(ctx.i18n.t('menu.newSearch'), GLOBAL_ACTIONS.search),
                Markup.button.callback(ctx.i18n.t('menu.mySearches'), GLOBAL_ACTIONS.searches),
                Markup.button.callback(ctx.i18n.t('menu.shareBot'), GLOBAL_ACTIONS.share),
            ],
            {
                columns: 2,
            }
        )
    );
}

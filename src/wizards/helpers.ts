import { Markup } from 'telegraf';
import { TelegrafContext } from 'types';
import { ACTIONS } from './types';

export const cancelSearchReply = async (ctx: TelegrafContext, message: string) => {
    return ctx.replyWithMarkdown(
        message,
        Markup.inlineKeyboard([
            Markup.button.callback(ctx.i18n.t('wizardSearch.cancelSearch'), ACTIONS.CANCEL),
        ])
    );
};

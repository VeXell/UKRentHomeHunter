import { Telegraf, Scenes } from 'telegraf';
import { TelegrafContext } from 'types';
import searchWizard from './search';
import { ACTIONS } from './types';

export { WIZARD_TYPE as SEARCH_WIZARD_TYPE } from './search';

export function initWizards(bot: Telegraf<TelegrafContext>) {
    const stage = new Scenes.Stage<TelegrafContext>([searchWizard]);

    stage.action(ACTIONS.CANCEL, (ctx) => {
        ctx.reply(ctx.i18n.t('operationCanceled'));
        return ctx.scene.leave();
    });

    stage.command(ACTIONS.CANCEL, (ctx) => {
        ctx.reply(ctx.i18n.t('operationCanceled'));
        return ctx.scene.leave();
    });

    bot.use(stage.middleware());
}

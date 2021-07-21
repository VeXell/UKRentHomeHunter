import { STEP_BEDROOMS_MORE_ACTIONS } from '../types';
import { Markup, Composer } from 'telegraf';
import { TelegrafContext } from 'types';

const stepBedroomsMoreHandler = new Composer<TelegrafContext>();
stepBedroomsMoreHandler.action(STEP_BEDROOMS_MORE_ACTIONS.YES, async (ctx) => {
    ctx.scene.session.search.roomsMore = true;
    await ctx.replyWithMarkdown(ctx.i18n.t('wizardSearch.actions.budget'), Markup.removeKeyboard());
    return ctx.wizard.next();
});
stepBedroomsMoreHandler.action(STEP_BEDROOMS_MORE_ACTIONS.NO, async (ctx) => {
    ctx.scene.session.search.roomsMore = false;
    await ctx.replyWithMarkdown(ctx.i18n.t('wizardSearch.actions.budget'), Markup.removeKeyboard());
    return ctx.wizard.next();
});
stepBedroomsMoreHandler.use((ctx) =>
    ctx.replyWithMarkdown(ctx.i18n.t('wizardSearch.errors.bedroomsMore'))
);

export default stepBedroomsMoreHandler;

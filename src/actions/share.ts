import { TelegrafContext } from 'types';

export default async function startAction(ctx: TelegrafContext) {
    const messageIntro = ctx.i18n.t('share.intro');
    const messageShare = ctx.i18n.t('share.description');
    await ctx.reply(messageIntro);

    return ctx.reply(messageShare);
}

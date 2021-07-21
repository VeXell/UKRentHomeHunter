import { TelegrafContext } from 'types';

export default function startAction(ctx: TelegrafContext) {
    const message = ctx.i18n.t('helpInfo');
    return ctx.reply(message);
}

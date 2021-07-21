import { AVAILABLE_BEDROOMS } from '../types';
import { Markup } from 'telegraf';
import { TelegrafContext } from 'types';

export async function askForBedrooms(
    ctx: TelegrafContext & {
        match: RegExpExecArray;
    }
) {
    await ctx.replyWithMarkdown(
        ctx.i18n.t('wizardSearch.actions.bedrooms'),
        Markup.keyboard(AVAILABLE_BEDROOMS, {
            wrap: (_btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
        })
            .oneTime()
            .resize()
    );
}

export default null;

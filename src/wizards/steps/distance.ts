import { Markup, Composer } from 'telegraf';
import { TelegrafContext } from 'types';

import { askForBedrooms } from './bedrooms';
import { MILES } from 'services/db/search';

export enum STEP_DISTANCE_ACTIONS {
    MILE_1_4 = 'action_mile_1_4',
    MILE_1_2 = 'action_mile_1_2',
    MILE_1 = 'action_mile_1',
}

export async function askForDistance(ctx: TelegrafContext) {
    await ctx.replyWithMarkdown(
        ctx.i18n.t('wizardSearch.actions.distance'),
        Markup.inlineKeyboard([
            Markup.button.callback(ctx.i18n.t('distance.mile_1_4'), STEP_DISTANCE_ACTIONS.MILE_1_4),
            Markup.button.callback(ctx.i18n.t('distance.mile_1_2'), STEP_DISTANCE_ACTIONS.MILE_1_2),
            Markup.button.callback(ctx.i18n.t('distance.mile_1'), STEP_DISTANCE_ACTIONS.MILE_1),
        ])
    );
}

const stepDistanceHandler = new Composer<TelegrafContext>();
stepDistanceHandler.action(STEP_DISTANCE_ACTIONS.MILE_1_4, async (ctx) => {
    ctx.scene.session.search.distance = MILES.MILE_1_4;
    askForBedrooms(ctx);
    return ctx.wizard.next();
});
stepDistanceHandler.action(STEP_DISTANCE_ACTIONS.MILE_1_2, async (ctx) => {
    ctx.scene.session.search.distance = MILES.MILE_1_2;
    askForBedrooms(ctx);
    return ctx.wizard.next();
});
stepDistanceHandler.action(STEP_DISTANCE_ACTIONS.MILE_1, async (ctx) => {
    ctx.scene.session.search.distance = MILES.MILE_1;
    askForBedrooms(ctx);
    return ctx.wizard.next();
});
stepDistanceHandler.use((ctx) =>
    ctx.replyWithMarkdown(ctx.i18n.t('wizardSearch.errors.bedroomsMore'))
);

export default stepDistanceHandler;

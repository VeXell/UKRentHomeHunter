import { Scenes, Markup } from 'telegraf';
import { TelegrafContext } from 'types';
import { STEP_BEDROOMS_MORE_ACTIONS, AVAILABLE_BEDROOMS } from './types';

import { getSearchResultsCount } from 'processing/zoopla/services/search-results-count';
import { getSearchString, getOpenSearchUrl } from 'processing/zoopla/url';
import { addSearch, ISearchRequestInput, MILES } from 'services/db/search';
import { cancelSearchReply } from './helpers';
import { distanceToText } from 'utils';

import stepDistanceHandler from './steps/distance';
import stepBedroomsMoreHandler from './steps/bedrooms-more';
import stepLocationHandler from './steps/location';

export const WIZARD_TYPE = 'search-wizard';

export default new Scenes.WizardScene<TelegrafContext>(
    WIZARD_TYPE,
    async (ctx) => {
        const chatId = ctx.chat?.id;

        ctx.scene.session.search = {
            chatId,
        };

        await ctx.replyWithMarkdown(ctx.i18n.t('wizardSearch.actions.location'));
        return ctx.wizard.next();
    },
    stepLocationHandler,
    stepDistanceHandler,
    // Ask to show bedrooms+
    async (ctx) => {
        if (
            ctx.message &&
            'text' in ctx.message &&
            AVAILABLE_BEDROOMS.indexOf(ctx.message.text) !== -1
        ) {
            ctx.scene.session.search.rooms = ctx.message.text;

            let text;

            if (ctx.scene.session.search.rooms === 'studio') {
                text = ctx.i18n.t('wizardSearch.actions.studioMore');
            } else {
                const rooms = ctx.i18n.t('bedroom', { rooms: ctx.scene.session.search.rooms });
                text = ctx.i18n.t('wizardSearch.actions.bedroomsMore', { rooms });
            }

            await ctx.replyWithMarkdown(
                text,
                Markup.inlineKeyboard([
                    Markup.button.callback(ctx.i18n.t('yesPlease'), STEP_BEDROOMS_MORE_ACTIONS.YES),
                    Markup.button.callback(ctx.i18n.t('nope'), STEP_BEDROOMS_MORE_ACTIONS.NO),
                ])
            );
            return ctx.wizard.next();
        } else {
            return cancelSearchReply(ctx, ctx.i18n.t('wizardSearch.errors.bedrooms'));
        }
    },
    stepBedroomsMoreHandler,
    async (ctx) => {
        if (
            ctx.message &&
            'text' in ctx.message &&
            Number(ctx.message.text) > 0 &&
            Number(ctx.message.text) < 10000
        ) {
            ctx.scene.session.search.budget = Number(ctx.message.text);
            let rooms;

            if (ctx.scene.session.search.rooms === 'studio') {
                rooms = ctx.i18n.t('studio');
            } else {
                rooms = ctx.i18n.t('bedroom', { rooms: ctx.scene.session.search.rooms });
            }

            await ctx.replyWithMarkdown(
                ctx.i18n.t('wizardSearch.actions.done', {
                    budget: ctx.scene.session.search.budget,
                    area: ctx.scene.session.search.area,
                    rooms,
                    plus: ctx.scene.session.search.roomsMore ? '+' : '',
                    distance: distanceToText(ctx.scene.session.search.distance),
                }),
                Markup.removeKeyboard()
            );

            const { search } = ctx.scene.session;

            if (search.chatId) {
                const searchRequest: ISearchRequestInput = {
                    chatId: search.chatId,
                    budget: search.budget || 0,
                    area: search.area || '',
                    zooplaAreaId: search.zooplaAreaId,
                    roomsMore: Boolean(search.roomsMore),
                    rooms: search.rooms || '1',
                    distance: search.distance || MILES.MILE_1_4,
                };

                addSearch(searchRequest);
                let foundResults = 0;

                try {
                    const searchResult = await getSearchResultsCount(
                        getSearchString(searchRequest, '30_days')
                    );

                    foundResults = searchResult.totalResults;
                } catch (error) {}

                if (foundResults) {
                    const url = getOpenSearchUrl(searchRequest, '30_days');

                    await ctx.replyWithMarkdown(
                        ctx.i18n.t('wizardSearch.foundResults', {
                            count: foundResults,
                        }),
                        Markup.inlineKeyboard([
                            Markup.button.url(ctx.i18n.t('openSearchResults'), url),
                        ])
                    );
                } else {
                    await ctx.replyWithMarkdown(
                        ctx.i18n.t('wizardSearch.notFoundResults', {
                            count: foundResults,
                        }),
                        Markup.removeKeyboard()
                    );
                }
            }

            return ctx.scene.leave();
        } else {
            return cancelSearchReply(ctx, ctx.i18n.t('wizardSearch.errors.budget'));
        }
    }
);

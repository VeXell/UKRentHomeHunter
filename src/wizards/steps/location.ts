import { TelegrafContext } from 'types';
import { detectLocation } from 'processing/zoopla/services/location';
import { askForDistance } from './distance';
import { cancelSearchReply } from '../helpers';

class IncorrectMessageError extends Error {}
class NoLocationFoundError extends Error {}
class LocationAlreadyInSearchError extends Error {}

export default async function processLocation(ctx: TelegrafContext) {
    try {
        if (!ctx.message || !('text' in ctx.message) || ctx.message.text.length < 2) {
            throw new IncorrectMessageError(ctx.i18n.t('wizardSearch.errors.location'));
        }

        try {
            const location = await detectLocation(ctx.message.text);
            ctx.scene.session.search.area = location.locationName;
            ctx.scene.session.search.zooplaAreaId = location.locationId;
        } catch (error) {}

        if (!ctx.scene.session.search.area) {
            throw new NoLocationFoundError(ctx.i18n.t('wizardSearch.errors.locationNotFound'));
        }

        let locationAlreadyInSearch = false;

        if (ctx.session.activeSearches) {
            const searches = ctx.session.activeSearches;

            Object.keys(searches).forEach((key) => {
                const searchObject = searches[key];

                if (searchObject.zooplaAreaId === ctx.scene.session.search.zooplaAreaId) {
                    locationAlreadyInSearch = true;
                }
            });
        }

        if (locationAlreadyInSearch) {
            throw new LocationAlreadyInSearchError(
                ctx.i18n.t('wizardSearch.errors.locationAlreadyInSearch', {
                    location: ctx.scene.session.search.area,
                })
            );
        }

        await askForDistance(ctx);
        return ctx.wizard.next();
    } catch (error) {
        return cancelSearchReply(ctx, error.message);
    }
}

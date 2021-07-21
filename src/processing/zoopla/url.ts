/* eslint-disable camelcase */
import { ISearchRequestInput, MILES } from 'services/db/search';
import { ZOOPLA_URL } from './config';

type IZooplaQuery = {
    beds_min?: string;
    beds_max?: string;
    page_size: number;
    price_frequency: 'per_month';
    price_max: number;
    radius: number;
    results_sort: 'newest_listings';
    added: '14_days' | '24_hours' | '3_days' | '7_days' | '30_days';
};

export const getOpenSearchUrl = (
    searchConfig: ISearchRequestInput,
    added: IZooplaQuery['added']
) => {
    const path = getSearchString(searchConfig, added);
    return `${ZOOPLA_URL}${path}`;
};

export function getSearchString(searchConfig: ISearchRequestInput, added: IZooplaQuery['added']) {
    const searchString = `/to-rent/property/${searchConfig.zooplaAreaId}/`;

    let radius = 0.25;

    switch (searchConfig.distance) {
        case MILES.MILE_1_2:
            radius = 0.5;
            break;
        case MILES.MILE_1:
            radius = 1;
            break;
        default:
    }

    const query: IZooplaQuery = {
        page_size: 50,
        beds_min: searchConfig.rooms,
        price_frequency: 'per_month',
        price_max: searchConfig.budget,
        radius,
        results_sort: 'newest_listings',
        added,
    };

    if (searchConfig.roomsMore === false) {
        query.beds_max = searchConfig.rooms;
    }

    const params = Object.keys(query).map((key) => `${key}=${query[key as keyof IZooplaQuery]}`);

    return `${searchString}?${params.join('&')}`;
}

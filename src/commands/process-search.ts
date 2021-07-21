import moment from 'moment';
import { IS_DEV } from 'config';
import { getSearchResults } from 'processing/zoopla/services/search-results';
import { getSearchString } from 'processing/zoopla/url';
import { ZOOPLA_URL } from 'processing/zoopla/config';
import { updateSearch, ISearchRequestRecord } from 'services/db/search';

import {
    ISearchResultEntry,
    ISearchResult,
    getSaveKey,
    insertSearchResult,
} from 'services/db/search-results';

export default async function processSearch(
    chatId: number,
    searchId: string,
    search: ISearchRequestRecord,
    searchResults: ISearchResultEntry | null
) {
    // DEV MODE
    if (IS_DEV) {
        if (chatId !== 1903476) {
            return;
        }
    }

    console.log(`Process search in area "${search.area}"`);

    const data = await getZooplaProperties(search);
    if (data) {
        processNewSearchedProperties(chatId, searchId, data, searchResults);
        console.log(`Process ended for ${chatId}/${searchId}. Found ${data.length} properties`);
    }

    // Last action. Update seach time
    updateSearch(chatId, searchId, {
        lastSearchAt: moment().utc().format(),
    });
}

function processNewSearchedProperties(
    chatId: number,
    searchId: string,
    results: ISearchResult[],
    searchResults: ISearchResultEntry | null
) {
    results.forEach((search) => {
        const saveKey = getSaveKey(search);

        if (
            searchResults &&
            searchResults[chatId] &&
            searchResults[chatId][searchId] &&
            searchResults[chatId][searchId].searchResults[saveKey]
        ) {
            console.log(
                `Search result with key ${saveKey} in search ${chatId}/${searchId} already exists.`
            );
        } else {
            // Insert new search result
            insertSearchResult(chatId, searchId, search);
        }
    });
}

async function getZooplaProperties(search: ISearchRequestRecord) {
    const searchString = getSearchString(search, '24_hours');
    let entries: ISearchResult[] = [];

    try {
        const response = await getSearchResults(searchString);

        entries = response.results.map((entry) => {
            const images: string[] = [];

            if (entry.image) {
                images.push(entry.image.src);
            }

            if (Array.isArray(entry.otherPropertyImages)) {
                entry.otherPropertyImages.forEach((item) => {
                    images.push(item.large);
                });
            }

            return {
                id: entry.listingId,
                createdAt: entry.publishedOn,
                availableFrom: entry.availableFrom,
                price: entry.price,
                images,
                title: entry.title,
                address: entry.address,
                openUrl: `${ZOOPLA_URL}${entry.listingUris.detail}`,
                contactUrl: `${ZOOPLA_URL}${entry.listingUris.contact}`,
                source: 'zoopla',
            };
        });
    } catch (error) {
        //
    }

    return entries;
}

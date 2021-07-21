import moment from 'moment';
import { IS_DEV } from 'config';
import { ISearchEntries, getAllSearchesRef } from 'services/db/search';
import { ISearchResultEntry, getAllSearchResultsRef } from 'services/db/search-results';
import { doSearchProcessing } from 'commands';

const MIN_HOURS_TO_SEND_UPDATES = 18;
const DELAY_HOURS_TO_SEND_UPDATES = 3;

export default function init() {
    let searches: ISearchEntries | null = null;
    let searchResults: ISearchResultEntry | null = null;

    getAllSearchesRef().on('value', (snapshot) => {
        if (snapshot.exists()) {
            searches = snapshot.val();
        }
    });

    getAllSearchResultsRef().on('value', (snapshot) => {
        if (snapshot.exists()) {
            searchResults = snapshot.val();
        }
    });

    const timerValue = IS_DEV ? 1000 * 60 : 1000 * 600;
    const searchTimer = setInterval(() => {
        if (searches) {
            dailySearch(searches, searchResults);
        }
    }, timerValue);

    return () => {
        clearInterval(searchTimer);
    };
}

async function dailySearch(allSearches: ISearchEntries, searchResults: ISearchResultEntry | null) {
    console.log('Job. Daily search started');

    const chats = Object.keys(allSearches);

    for (const chatId of chats) {
        const chatSearches = allSearches[chatId];
        const searches = Object.keys(chatSearches);

        for (const searchId of searches) {
            console.log(`Found search ${searchId} in chat ${chatId}`);

            const search = chatSearches[searchId];
            const now = moment().utc();
            const expiredAt = moment(search.expiredAt);
            const createdAt = moment(search.createdAt);
            const createDuration = moment.duration(now.diff(createdAt));
            const hours = Math.round(createDuration.asHours());

            if (hours <= MIN_HOURS_TO_SEND_UPDATES) {
                console.log(
                    `Skip search bacause it created less than ${hours}h ago. min hours to send updates ${MIN_HOURS_TO_SEND_UPDATES}`
                );
                continue;
            }

            if (search.lastSearchAt) {
                const lastSearchAt = moment(search.lastSearchAt);
                const lastSearchDuration = moment.duration(now.diff(lastSearchAt));
                const hours = Math.round(lastSearchDuration.asHours());

                if (hours <= DELAY_HOURS_TO_SEND_UPDATES) {
                    console.log(`Skip search because of time. Last search ${hours}h ago`);
                    continue;
                }
            }

            if (now <= expiredAt) {
                await doSearchProcessing(Number(chatId), searchId, search, searchResults);
            } else {
                console.log(`Skip because expired`);
            }
        }
    }
}

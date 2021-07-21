import moment from 'moment';
import { removeSearch, ISearchEntries, getAllSearchesRef } from 'services/db/search';
import { removeSearchResults } from 'services/db/search-results';

export default function init() {
    let searches: ISearchEntries | null = null;

    getAllSearchesRef().on('value', (snapshot) => {
        if (snapshot.exists()) {
            searches = snapshot.val();
        }
    });

    const removeExpiredTimer = setInterval(() => {
        if (searches) {
            removeExpired(searches);
        }
    }, 1000 * 1800);

    return () => {
        clearInterval(removeExpiredTimer);
    };
}

async function removeExpired(allSearches: ISearchEntries) {
    console.log('Job. Remove expired searches');

    const chats = Object.keys(allSearches);
    const now = moment().utc();

    for (const chatId of chats) {
        const chatSearches = allSearches[chatId];
        const searches = Object.keys(chatSearches);

        for (const searchId of searches) {
            const search = chatSearches[searchId];
            const expiredAt = moment(search.expiredAt);

            if (now >= expiredAt) {
                console.log(
                    `Search "${chatId}/${searchId}" expired ${expiredAt.format()}. Remove it.`
                );

                await Promise.all([
                    removeSearchResults(Number(chatId), searchId),
                    removeSearch(Number(chatId), searchId),
                ]);
            }
        }
    }
}

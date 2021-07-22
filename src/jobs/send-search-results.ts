import moment from 'moment';
import { Telegraf, Markup } from 'telegraf';

import { TelegrafContext } from 'types';
import { IS_DEV } from 'config';
import { ISearchEntries, getAllSearchesRef, removeSearch } from 'services/db/search';
import {
    ISearchResultEntry,
    getAllSearchResultsRef,
    ISearchResult,
    setLastNotification,
    setPropertyIsSubmitted,
    removeSearchResults,
} from 'services/db/search-results';

const MIN_MINUTES_TO_SEND_DATA = 5;

let telegramBot: Telegraf<TelegrafContext> | undefined;

export default function init(bot: Telegraf<TelegrafContext>) {
    telegramBot = bot;

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

    const timerValue = IS_DEV ? 1000 * 60 : 1000 * 300;
    const dailySendTimer = setInterval(() => {
        const hours = Number(moment().utc().format('H'));

        if (searches) {
            if (IS_DEV) {
                processResults(searches, searchResults);
            } else {
                if (hours >= 8 && hours <= 22) {
                    processResults(searches, searchResults);
                }
            }
        }
    }, timerValue);

    return () => {
        clearInterval(dailySendTimer);
    };
}

async function processResults(
    allSearches: ISearchEntries,
    allSearchResults: ISearchResultEntry | null
) {
    console.log('Job. Send results');

    if (allSearchResults) {
        const chats = Object.keys(allSearchResults);
        const now = moment().utc();

        for (const chatId of chats) {
            const searches = Object.keys(allSearchResults[chatId]);

            for (const searchId of searches) {
                const searchResults = allSearchResults[chatId][searchId].searchResults;
                /* const lastNotification = allSearchResults[chatId][searchId].lastNotificationAt;

                if (lastNotification) {
                    const lastNotificationDuration = moment.duration(now.diff(lastNotification));
                    const minutes = Math.round(lastNotificationDuration.asMinutes());

                    if (minutes < MIN_MINUTES_TO_SEND_DATA) {
                        // Delay
                        console.log(
                            `Skip send to chat ${chatId} because of ${MIN_MINUTES_TO_SEND_DATA}min delay`
                        );
                        continue;
                    }
                } */

                // Send data to messenger

                if (allSearches && allSearches[chatId] && allSearches[chatId][searchId]) {
                    const area = allSearches[chatId][searchId].area;
                    sendResults(Number(chatId), searchId, searchResults, area);
                } else {
                    console.error(`Can not get area in allSearches ${chatId}/${searchId}`);
                }
            }
        }
    }
}

async function sendResults(
    chatId: number,
    searchId: string,
    searchResults: { [key: string]: ISearchResult },
    area: string
) {
    // DEV MODE
    if (IS_DEV) {
        if (chatId !== 1903476) {
            return;
        }
    }

    const propertyKeys = Object.keys(searchResults);

    for (const propertyKey of propertyKeys) {
        const searchResult = searchResults[propertyKey];

        if (!searchResult.isSubmitted) {
            // Send to messenger and update last notification time

            if (telegramBot) {
                console.log(`Send mesasge to chat ${chatId}/${searchId} in area ${area}`);

                const message = formatTgMessage(area, searchResult);
                const media = message.media.slice(0, 10);

                let submitted = false;

                try {
                    if (media.length) {
                        await telegramBot.telegram.sendMediaGroup(chatId, media);
                    }

                    await telegramBot.telegram.sendMessage(chatId, message.text, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [[Markup.button.url('↗️ Open', searchResult.openUrl)]],
                        },
                    });
                    submitted = true;
                } catch (error) {
                    if (error.response?.error_code === 400) {
                        // Chat not found
                    }

                    if (error.response?.error_code === 403) {
                        // Chat has been blocked
                        await removeSearch(chatId, searchId);
                        await removeSearchResults(chatId, searchId);
                    }

                    console.error(error);
                    break;
                }

                if (submitted) {
                    setPropertyIsSubmitted(chatId, searchId, searchResult);
                    setLastNotification(chatId, searchId, moment().utc().format());
                    break;
                }
            }
        }
    }
}

function formatTgMessage(
    area: string,
    searchResult: ISearchResult
): { media: { type: 'photo'; media: string; caption?: string }[]; text: string } {
    // const caption = `Property at ${area}.`;

    const images = Array.isArray(searchResult.images) ? searchResult.images : [];

    return {
        media: images.map((imageUrl) => {
            return {
                type: 'photo',
                media: imageUrl,
            };
        }),

        text: `
🏠 ${searchResult.title} / 💷 *${searchResult.price}* 
🗓 Available from *${searchResult.availableFrom}*
📍 *${searchResult.address}*

Search in ${area}`,
    };
}
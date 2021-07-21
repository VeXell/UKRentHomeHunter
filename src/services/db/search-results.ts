import { getDB } from './index';

const PATH = 'results';

export type ISearchResult = {
    id: string;
    title?: string;
    price?: string;
    createdAt?: string;
    availableFrom?: string;
    address?: string;
    images: string[];
    openUrl: string;
    contactUrl?: string;
    source: 'zoopla';
    isSubmitted?: boolean;
};

export type ISearchResultEntry = {
    [key: string]: {
        [key: string]: {
            lastNotificationAt: string | null;
            searchResults: { [key: string]: ISearchResult };
        };
    };
};

export function getSaveKey(searchResult: ISearchResult) {
    return `${searchResult.source}-${searchResult.id}`;
}
export function insertSearchResult(chatId: number, searchId: string, searchResult: ISearchResult) {
    const resultsRef = getDB().ref(
        `${PATH}/${chatId}/${searchId}/searchResults/${getSaveKey(searchResult)}`
    );

    return resultsRef.set({
        ...searchResult,
        ...{
            isSubmitted: false,
        },
    });
}

export function setLastNotification(chatId: number, searchId: string, lastNotificationAt: string) {
    return getDB().ref(`${PATH}/${chatId}/${searchId}/lastNotificationAt`).set(lastNotificationAt);
}

export function setPropertyIsSubmitted(
    chatId: number,
    searchId: string,
    searchResult: ISearchResult
) {
    return getDB()
        .ref(`${PATH}/${chatId}/${searchId}/searchResults/${getSaveKey(searchResult)}/isSubmitted`)
        .set(true);
}

export function getAllSearchResultsRef() {
    return getDB().ref(`${PATH}`);
}

export async function removeSearchResults(chatId: number, index: string): Promise<boolean> {
    await getDB().ref(`${PATH}/${chatId}/${index}`).remove();
    return true;
}

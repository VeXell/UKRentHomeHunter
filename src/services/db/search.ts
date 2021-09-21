import { getDB } from './index';
import moment from 'moment';

const PATH = 'searches';
export enum MILES {
    MILE_1_2 = 'mile_1.2',
    MILE_1_4 = 'mile_1.4',
    MILE_1 = 'mile_1',
}

export interface ISearchRequestInput {
    chatId: number;
    area: string;
    zooplaAreaId?: string;
    rooms: string;
    roomsMore: boolean;
    budget: number;
    distance: MILES;
}

export interface ISearchRequestRecord extends ISearchRequestInput {
    createdAt: string;
    expiredAt: string;
    lastSearchAt: string | null;
}

export type ISearchRecords = { [key: string]: ISearchRequestRecord };
export type ISearchEntries = { [key: string]: ISearchRecords };

export function addSearch(searchRequest: ISearchRequestInput): Promise<ISearchRequestRecord> {
    const searchesListRef = getDB().ref(`${PATH}/${searchRequest.chatId}`);
    const searchRef = searchesListRef.push();

    return searchRef.set({
        ...searchRequest,
        ...{
            createdAt: moment.utc().format(),
            expiredAt: moment.utc().add(60, 'days').format(),
            lastSearchAt: null,
        },
    });
}

export async function getActiveSeachesCount(chatId: number): Promise<number> {
    const searchesList = await getDB().ref(`${PATH}/${chatId}`).get();

    if (searchesList.exists()) {
        const data = searchesList.toJSON() as ISearchRecords;
        return Object.keys(data).length;
    }

    return 0;
}

export async function getSearches(chatId: number): Promise<ISearchRecords | null> {
    const searchesList = await getDB().ref(`${PATH}/${chatId}`).get();

    if (searchesList.exists()) {
        return searchesList.toJSON() as ISearchRecords;
    }

    return null;
}

export async function removeSearch(chatId: number, index: string): Promise<boolean> {
    await getDB().ref(`${PATH}/${chatId}/${index}`).remove();
    return true;
}

type IUpdateSearchRecord = Partial<ISearchRequestRecord>;
export function updateSearch(chatId: number, index: string, search: IUpdateSearchRecord) {
    return getDB().ref(`${PATH}/${chatId}/${index}`).update(search);
}

export async function getAllSearches(): Promise<ISearchEntries | null> {
    const searches = await getDB().ref(`${PATH}`).get();

    if (searches.exists()) {
        return searches.toJSON() as ISearchEntries;
    }

    return null;
}

export function getAllSearchesRef() {
    return getDB().ref(`${PATH}`);
}

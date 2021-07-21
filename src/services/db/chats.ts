import { getDB } from './index';

const PATH = 'chats';

interface IChatData {
    firstName: string;
    lastName: string;
    username: string;
    language: string;
    isDoSearchAction?: boolean;
}

export function addChat(chatId: number, chat: IChatData) {
    return getDB()
        .ref(`${PATH}/${chatId}`)
        .set({ ...chat, ...{ isDoSearchAction: false } });
}

type IUpdateChatData = Partial<IChatData>;

export function updateChat(chatId: number, chat: IUpdateChatData) {
    return getDB()
        .ref(`${PATH}/${chatId}`)
        .update({ ...chat, ...{ isDoSearchAction: true } });
}

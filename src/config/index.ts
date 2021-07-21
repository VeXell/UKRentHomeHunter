export const DATABASE = process.env.FIREBASE_DATABASE as string;
export const MAX_SEARCHES = 3;
export const FIREBASE_AUTH = {
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
};
export const IS_DEV = process.env.NODE_ENV === 'development';
export const BOT_TOKEN = IS_DEV
    ? (process.env.TEST_BOT_TOKEN as string)
    : (process.env.BOT_TOKEN as string);

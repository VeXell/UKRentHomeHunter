import admin, { ServiceAccount } from 'firebase-admin';

export const initDatabase = (authCredentials: ServiceAccount, database: string) => {
    admin.initializeApp({
        credential: admin.credential.cert(authCredentials),
        databaseURL: database,
    });
};

export const getDB = () => {
    return admin.database();
};

import { injectable } from 'inversify';

@injectable()
export class LocalStorage {
    public get = <T>(field: string): T | undefined => {
        const databaseObject = localStorage.getItem(field);
        if (databaseObject) {
            return JSON.parse(databaseObject);
        }
    };

    public remove = (field: string): void => {
        localStorage.removeItem(field);
    };

    public set = (field: string, data: unknown): void => {
        localStorage.setItem(field, JSON.stringify(data));
    };
}

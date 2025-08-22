import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private static readonly databaseName = 'timeIsUp2';
  private static readonly currentVersion = 1;
  private static readonly settingsStore = 'settings';

  constructor() {
    this.executeOnDb(db => {
      return this.withTransaction(DbService.settingsStore, true, db, tx => {
        return this.get('default', tx.objectStore(DbService.settingsStore));
      });
    }).then(x => console.log(x));
  }

  executeOnDb<T>(callback: (database: IDBDatabase) => T): Promise<T> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const openRequest = window.indexedDB.open(DbService.databaseName, DbService.currentVersion);
      openRequest.onerror = () => reject(openRequest.error!);
      openRequest.onblocked = () => reject(openRequest.error ?? new Error('Database is blocked.'));
      openRequest.onsuccess = () => resolve(openRequest.result);
      openRequest.onupgradeneeded = ev => this.onMigrate(ev.oldVersion, ev.newVersion!, openRequest.result);
    }).then(db => {
      const ret = callback(db);
      db.close();
      return ret;
    });
  }

  get<T>(query: IDBValidKey | IDBKeyRange, store: IDBObjectStore): Promise<T> {
    return this.requestToPromise(store.get(query));
  }

  getAll<T>(query: IDBValidKey | IDBKeyRange | undefined, count: number | undefined, store: IDBObjectStore): Promise<T[]> {
    return this.requestToPromise(store.getAll(query == undefined ? null : query, count));
  }

  withTransaction<T>(storeNames: string | string[], readWrite: boolean, database: IDBDatabase, callback: (transaction: IDBTransaction) => T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(storeNames, readWrite ? 'readwrite' : 'readonly');
      transaction.onabort = () => reject(new Error('Transaction aborted.'));
      transaction.onerror = () => reject(transaction.error!);
      let result: T | undefined;
      transaction.oncomplete = () => resolve(result!);
      result = callback(transaction);
      if (readWrite) {
        transaction.commit();
      }
    });
  }

  private onMigrate(oldVersion: number, newVersion: number, db: IDBDatabase) {
    console.log(`Migrate IndexedDB from ${oldVersion} to ${newVersion}.`);
    this.onMigrateV1(db);
  }

  private onMigrateV1(db: IDBDatabase) {
    db.createObjectStore(DbService.settingsStore);

  }

  private requestToPromise<T>(request: IDBRequest): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      request.onerror = () => reject(request.error!);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

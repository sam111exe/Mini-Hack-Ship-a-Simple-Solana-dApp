import type { AuthStorage } from "./auth_cubit";

abstract class StorageBase<T> {
  // Should fill this.store with data from storage
  abstract load_data(): Promise<T> | T;
  // Should save this.store to storage
  abstract save_data(): Promise<void> | void;
}

export abstract class ListStorageBase<T> extends StorageBase<T> {
  store: T[] = [];
  config: { id_fields: string[] };

  constructor(config: typeof ListStorageBase.prototype.config) {
    super();
    this.config = config;
    this.load_data();
  }

  // PUBLIC METHODS ========================================

  public replace_store(data: T[]) {
    this.store = data;
    this.save_data();
  }

  public merge_store(data: T[]) {
    this.store = [...this.store, ...data];
    this.save_data();
  }

  public add(item: T) {
    this.store.push(item);
    this.save_data();
  }

  public get_all(): T[] {
    return this.store;
  }

  public find_one(filter: (item: T) => boolean): T | undefined {
    return this.store.find(filter);
  }

  public insert_or_update(data: any) {
    let found = this.store.find((x: any) => this.config.id_fields.every((field) => x[field] === data[field]));
    if (found) {
      Object.assign(found, data);
    } else {
      this.store.push(data);
    }
    this.save_data();
  }
}

export abstract class KeyValueStorageBase<T> extends StorageBase<T> {
  store: T = {} as T;
  constructor() {
    super();
    this.init();
  }

  async init() {
    this.store = await this.load_data();
  }

  // PUBLIC METHODS ========================================

  public get_store(): T {
    return this.store;
  }

  public set_store(data: T) {
    this.store = data;
    this.save_data();
  }

  public replace_store(data: T) {
    this.store = data;
    this.save_data();
  }

  public merge_store(data: T) {
    this.store = { ...this.store, ...data };
    this.save_data();
  }

  public get_item<K extends keyof T>(key: K): T[K] {
    return this.store[key];
  }

  public set_item<K extends keyof T>(key: K, value: T[K]): void {
    console.error(`Setting item ${String(key)} to`, value);
    this.store[key] = value;
    this.save_data();
  }
}

export class AuthLocalStorage extends KeyValueStorageBase<AuthStorage> {
  load_data(): AuthStorage {
    if (typeof window === "undefined")
      return {
        accounts: [],
        current_account_uuid: null,
      };
    const data = localStorage.getItem("auth");
    if (data) {
      return JSON.parse(data);
    }
    return {
      accounts: [],
      current_account_uuid: null,
    } as AuthStorage;
  }
  save_data(): void | Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth", JSON.stringify(this.store));
    return;
  }
}

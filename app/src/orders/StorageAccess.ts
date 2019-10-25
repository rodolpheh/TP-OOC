import {
  delAsync, getAsync, setAsync,
} from '../../utils/storage'

import IStorageGetter from './IStorageAccess'

class StorageAccess<T> implements IStorageGetter<T> {
  private field: string

  constructor(field: string) {
    this.field = field
  }

  /**
   * Return the entry of the database as type T[]
   * @returns
   */
  public async get(): Promise<T[]> {
    return getAsync(this.field)
      .then((value: string) => JSON.parse(value) as T[])
  }

  /**
   * Set the entry from the Redis database with an array of T
   * @param   data
   * @returns
   */
  public async set(data: T[]): Promise<void> {
    return setAsync(this.field, JSON.stringify(data))
  }

  /**
   * Delete the entry from the Redis database
   * @returns
   */
  public async clean(): Promise<void> {
    return delAsync(this.field)
  }

}

export default StorageAccess
export {StorageAccess}

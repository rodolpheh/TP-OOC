interface IStorageAccess<T> {
  get(): Promise<T[]>
  set(data: T[]): Promise<void>
  clean(): Promise<void>
}

export default IStorageAccess

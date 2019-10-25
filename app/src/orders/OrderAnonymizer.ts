import IStorageAccess from './IStorageAccess'

import {
  IContact,
  IOrder,
} from './Order'

import {
  StorageAccess,
} from './StorageAccess'

class OrderAnonymizer implements IStorageAccess<IOrder> {
  private storageAccess: IStorageAccess<IOrder> = new StorageAccess('orders')

  /**
   * Return the orders, with the contact data removed
   * @returns
   */
  public async get(): Promise<IOrder[]> {
    return this.storageAccess.get()
      .then((orders: IOrder[]) => {
        const newContact: IContact = {
          firstname: 'Anonymous',
        } as IContact
        orders.forEach((order: IOrder) => {
          order.contact = newContact
        })
        return orders
      })
  }

  /**
   * Set the entry from the Redis database with an array of IOrder
   * @param   data
   * @returns
   */
  public async set(data: IOrder[]): Promise<void> {
    return this.storageAccess.set(data)
  }

  /**
   * Delete the entry from the Redis database
   * @returns
   */
  public async clean(): Promise<void> {
    return this.storageAccess.clean()
  }
}

export default OrderAnonymizer

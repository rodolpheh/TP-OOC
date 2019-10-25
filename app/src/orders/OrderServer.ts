import {
  IOrder,
  Order,
} from './Order'

import {
  StorageAccess,
} from './StorageAccess'

class OrderServer {
  private storageAccess: StorageAccess<IOrder> = new StorageAccess<IOrder>('orders')

  /**
   * Get an entry from the database. If no id is supplied, returns all the entries.
   * @param   id?
   * @returns
   */
  public async get(id?: number): Promise<IOrder[] | IOrder | void | number> {
    // We load the orders
    return this.storageAccess.get()
      .then((orders: IOrder[]) => {
        // We send back the whole array if no id was given
        if (id === undefined) {
          return orders
        }
        // We send back the specific order if it exists, otherwise we reject
        if (orders) {
          const order: IOrder = orders.find((item: IOrder) => item.id === Number(id))
          if (order) {
            return order
          }
        }
        return Promise.reject(404)
      })
  }

  /**
   * Set the data of the entry given by the id
   * @param   id
   * @param   data
   * @returns
   */
  public async set(id: number, data: IOrder): Promise<number | void> {
    return this.storageAccess.get()
      .then((orders: IOrder[]) => {
        // First find the index of the searched entry
        const index: number = orders.findIndex(
          (order: IOrder) => order.id === Number(id),
        )
        // Change and save the data
        if (index !== -1) {
          // Clean the data from the id and the date if supplied
          delete data.id
          delete data.createdAt
          // We change the contact data if it is supplied, otherwise we
          // return a 204 (No content)
          if (Object.keys(data).length > 0) {
            orders[index] = new Order(orders[index].id, data)
          } else {
            // express response objects will not forward a response body if the response
            // status code is 204 No Content. As such, it will not show up in Postman
            return Promise.reject(204)
          }
          return this.storageAccess.set(orders)
            .then(() => Promise.resolve())
        }
        // Return a rejected Promise if we don't find the searched entry
        return Promise.reject(404)
      })
  }

  /**
   * Add an entry to the database
   * @param   data
   * @returns
   */
  public async add(data: IOrder): Promise<number | void> {
    return this.storageAccess.get()
      .then((orders: IOrder[]) => {
        // We create an empty array if it doesn't exist yet
        orders = orders || []
        // We sort the orders by id so we can easily get the latest id
        orders = orders.sort((a: IOrder, b: IOrder) => a.id - b.id)
        const index: number = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1
        // We add a new order to the array
        orders = orders.concat(new Order(index, data))
        return this.storageAccess.set(orders)
          .then(() => Promise.resolve(index))
      })
  }

  /**
   * Remove the entry given by the id
   * @param   id
   * @returns
   */
  public async remove(id: number): Promise<number | void> {
    return this.storageAccess.get()
      .then((orders: IOrder[]) => {
        // First find the index of the searched entry
        const index: number = orders.findIndex(
          (order: IOrder) => order.id === Number(id),
        )
        // Remove the entry from the array and save the array
        if (index !== -1) {
          orders.splice(index, 1)
          return this.storageAccess.set(orders)
            .then(() => Promise.resolve())
        }
        // Return a rejected Promise if we don't find the searched entry
        return Promise.reject(404)
      })
  }

  /**
   * Remove all the entries from the database
   * @returns
   */
  public async clean(): Promise<void> {
    return this.storageAccess.clean()
  }
}

export default OrderServer
export {OrderServer}

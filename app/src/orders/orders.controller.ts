/**
 * @author Rodolphe Houdas
 * @file Manages the routes to `/orders` with a RESTful-compliant API
 * @requires NPM:express
 * @requires ../../utils/storage
 * @requires Order
 */

import {
  Request,
  Response,
  Router,
} from 'express'

import {
  delAsync, getAsync, setAsync,
} from '../../utils/storage'

import Order from './Order'

export default class OrdersController {
  public path: string = '/orders'
  public router: Router = Router()

  constructor() {
    this.initializeRoutes()
  }

  /**
   * Get all orders
   * @param   request
   * @param   response
   * @returns
   */
  public getAll = async (request: Request, response: Response): Promise<void> => {
    getAsync('orders')
      .then((value: string): Response => response.json(JSON.parse(value)))
  }

  /**
   * Get an entry from the database
   * @param   request
   * @param   response
   * @returns
   */
  public getOne = async (request: Request, response: Response): Promise<void> => {
    this.findOrder(Number(request.params.id))
      .then((value: Order): Response => response.json(value))
      .catch((): Response => response.sendStatus(404))
  }

  /**
   * Create an entry in the database with the passed data
   * @param   request
   * @param   response
   * @returns
   */
  public createOne = async (request: Request, response: Response): Promise<void> => {
    // We fetch the data
    getAsync('orders')
      // We parse the data
      .then((value: string) => JSON.parse(value))
      // We then proceed to build and add the object to the array
      .then((orders: Order[]) => {
        // We create an empty array if it doesn't exist yet
        orders = orders || []
        // We sort the orders by id so we can easily get the latest id
        orders = orders.sort((a: Order, b: Order) => a.id - b.id)
        // We add a new order to the array
        orders = orders.concat(new Order(
          orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
          request.body.contact,
        ))
        // We send the data to the database
        this.send(
          orders,
          response,
          201,
          `/orders/${orders.length}`,
        )
      })
  }

  /**
   * Called when a POST request is made with an id
   * @param   request
   * @param   response
   * @returns
   */
  public wrongPost = async (request: Request, response: Response): Promise<void> => {
    this.findOrder(Number(request.params.id))
      .then((): Response => response.sendStatus(409))
      .catch((): Response => response.sendStatus(404))
  }

  /**
   * We don't allow a modification of all the entries at once so this function
   * returns a 405 (Method Not Allowed)
   * @param   request
   * @param   response
   * @returns
   */
  public updateAll = async (request: Request, response: Response): Promise<void> => {
    response.sendStatus(405)
  }

  /**
   * Update an entry with the passed data
   * @param   request
   * @param   response
   * @returns
   */
  public updateOne = async (request: Request, response: Response): Promise<void> => {
    // We get the data
    getAsync('orders')
      // We parse the data
      .then((value: string): Order[] => JSON.parse(value))
      // We proceed to the removal from the list
      .then((orders: Order[]) => {
        // First find the index of the searched entry
        const index: number = orders.findIndex(
          (order: Order) => order.id === Number(request.params.id),
        )
        // Change the data
        if (index !== -1) {
          // We change the contact data if it is supplied, otherwise we
          // return a 204 (No content)
          if ('contact' in request.body) {
            orders[index] = new Order(orders[index].id, request.body.contact)
          } else {
            // express response objects will not forward a response body if the response
            // status code is 204 No Content. As such, it will not show up in Postman
            return Promise.reject(204)
          }
          return orders
        }
        // Return a rejected Promise if we don't find the searched entry
        return Promise.reject(404)
      })
      // We save the data
      .then((orders: Order[]) => this.send(orders, response, 200))
      // We return the HTTP status code set up during the rejection
      .catch((status: number) => response.sendStatus(status))
  }

  /**
   * Delete all the orders
   * @param   request
   * @param   response
   * @returns
   */
  public deleteAll = async (request: Request, response: Response): Promise<void> => {
    delAsync('orders').
      then((): Response => response.sendStatus(200))
  }

  /**
   * Delete an order from the list of orders
   * @param   request
   * @param   response
   * @returns
   */
  public deleteOne = async (request: Request, response: Response): Promise<void> => {
    // We get the data
    getAsync('orders')
      // We parse the data
      .then((value: string): Order[] => JSON.parse(value))
      // We proceed to the removal from the list
      .then((orders: Order[]) => {
        // First find the index of the searched entry
        const index: number = orders.findIndex(
          (order: Order) => order.id === Number(request.params.id),
        )
        // Remove the entry from the array
        if (index !== -1) {
          orders.splice(index, 1)
          return orders
        }
        // Return a rejected Promise if we don't find the searched entry
        return Promise.reject()
      })
      // We save the data
      .then((orders: Order[]) => this.send(orders, response, 200))
      // We return an error 404 if the entry was not found
      .catch(() => response.sendStatus(404))
  }

  private initializeRoutes(): void {
    // GET    ->  READ
    // 200 (OK), list of customers.
    this.router.get(`${this.path}`, this.getAll)
    // 200 (OK), single customer. 404 (Not Found), if ID not found or invalid.
    this.router.get(`${this.path}/:id`, this.getOne)

    // POST   ->  CREATE
    // 201 (Created), 'Location' header with link to /customers/{id} containing new ID.
    this.router.post(`${this.path}`, this.createOne)
    // 404 (Not Found), 409 (Conflict) if resource already exists..
    this.router.post(`${this.path}/:id`, this.wrongPost)

    // PUT    ->  UPDATE
    // 405 (Method Not Allowed), unless you want to modify the collection itself.
    this.router.put(`${this.path}`, this.updateAll)
    // 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid.
    this.router.put(`${this.path}/:id`, this.updateOne)

    // DELETE ->  DELETE
    // 200 (OK)
    this.router.delete(`${this.path}`, this.deleteAll)
    // 200 (OK). 404 (Not Found), if ID not found or invalid.
    this.router.delete(`${this.path}/:id`, this.deleteOne)
  }

  /**
   * Search for a specific order by id and resolve it or reject it if it doesn't exist
   * @param   id
   * @returns
   */
  private findOrder = async (id: number): Promise<Order> => {
    return new Promise((
        resolve: (value?: Order | PromiseLike<Order>) => void,
        reject: (reason?: any) => void,
      ): void => {
        // We load the orders
        getAsync('orders')
          // We parse them
          .then((value: string) => JSON.parse(value))
          // We reject it if it's empty, otherwise we search our order
          .then((value: Order[]) => (
            value ? value.find((item: Order) => item.id === Number(id)) : reject()
          ))
          // We reject if it doesn't exist, otherwise we resolve
          .then((value: Order) => value ? resolve(value) : reject())
      })
  }

  /**
   * Send data to the database
   * @param   orders
   * @param   response
   * @param   status
   * @param   locationHeader?
   * @returns
   */
  private send = async (
      orders: Order[],
      response: Response,
      status: number,
      locationHeader?: string,
  ): Promise<void> => {
    setAsync('orders', JSON.stringify(orders))
      .then((): Response => {
        return response.location(locationHeader).sendStatus(status)
      })
  }
}

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
  IOrder,
} from './Order'

import {
  OrderServer,
} from './OrderServer'

export default class OrdersController {
  public path: string = '/orders'
  public router: Router = Router()
  public orderServer: OrderServer = new OrderServer()

  constructor() {
    this.initializeRoutes()
  }

  /**
   * Get one or all entries from the database
   * @param   request
   * @param   response
   * @returns
   */
  public read = async (request: Request, response: Response): Promise<void> => {
    // If an id was supplied, we ask for the specific entry,
    // otherwise we return ask for all the entries by not supplying an id
    if (request.params.id) {
      this.orderServer.get(Number(request.params.id))
        .then((value: IOrder) => response.json(value))
        .catch((reason: number) => response.sendStatus(reason))
    } else {
      this.orderServer.get()
        .then((orders: IOrder[]) => response.json(orders))
        .catch((reason: number) => response.sendStatus(reason))
    }
  }

  /**
   * Create an entry in the database with the passed data
   * @param   request
   * @param   response
   * @returns
   */
  public create = async (request: Request, response: Response): Promise<void> => {
    // If an id was supplied, we'll just check for existence of the entry and
    // return an error message. Otherwise, we'll add the entry
    if (request.params.id) {
      this.orderServer.get(Number(request.params.id))
        .then(() => response.sendStatus(409))
        .catch(() => response.sendStatus(404))
    } else {
      this.orderServer.add(request.body as IOrder)
        .then((id: number) => response.location(`/orders/${id}`).sendStatus(201))
    }
  }

  /**
   * Update an entry with the passed data
   * @param   request
   * @param   response
   * @returns
   */
  public update = async (request: Request, response: Response): Promise<void> => {
    // If an id was supplied, we'll update the entry. Otherwise, we'll
    // return a 405 error
    if (request.params.id) {
      this.orderServer.set(Number(request.params.id), request.body as IOrder)
        .then(() => response.sendStatus(200))
        .catch((reason: number) => response.sendStatus(reason))
    } else {
      response.sendStatus(405)
    }
  }

  /**
   * Delete on or all entries from the list of orders
   * @param   request
   * @param   response
   * @returns
   */
  public delete = async (request: Request, response: Response): Promise<void> => {
    // If no id was supplied, we'll clean the whole DB
    // otherwhise we remove the entry
    if (!request.params.id) {
      this.orderServer.clean()
        .then((): Response => response.sendStatus(200))
    } else {
      this.orderServer.remove(Number(request.params.id))
        .then(() => response.sendStatus(200))
        .catch((reason: number) => response.sendStatus(reason))
    }
  }

  private initializeRoutes(): void {
    // GET    ->  READ
    // 200 (OK), list of customers.
    this.router.get(`${this.path}`, this.read)
    // 200 (OK), single customer. 404 (Not Found), if ID not found or invalid.
    this.router.get(`${this.path}/:id`, this.read)

    // POST   ->  CREATE
    // 201 (Created), 'Location' header with link to /customers/{id} containing new ID.
    this.router.post(`${this.path}`, this.create)
    // 404 (Not Found), 409 (Conflict) if resource already exists..
    this.router.post(`${this.path}/:id`, this.create)

    // PUT    ->  UPDATE
    // 405 (Method Not Allowed), unless you want to modify the collection itself.
    this.router.put(`${this.path}`, this.update)
    // 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid.
    this.router.put(`${this.path}/:id`, this.update)

    // DELETE ->  DELETE
    // 200 (OK)
    this.router.delete(`${this.path}`, this.delete)
    // 200 (OK). 404 (Not Found), if ID not found or invalid.
    this.router.delete(`${this.path}/:id`, this.delete)
  }
}

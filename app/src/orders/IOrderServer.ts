import {
  IOrder,
} from './Order'

interface IOrderServer {
  get(id?: number): Promise<IOrder[] | IOrder | void | number>
  set(id: number, data: IOrder): Promise<number | void>
  add(data: IOrder): Promise<number | void>
  remove(id: number): Promise<number | void>
  clean(): Promise<void>
}

export default IOrderServer

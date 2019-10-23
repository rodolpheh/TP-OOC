/**
 * @author Rodolphe Houdas
 * @file Defines an order class
 */

class Order {
  public id: number
  public contact: string

  private createdAt: Date

  constructor(id: number, contact: string) {
    this.createdAt = new Date()
    this.id = id
    this.contact = contact
  }
}

export default Order

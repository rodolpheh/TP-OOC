/**
 * @author Rodolphe Houdas
 * @file Defines an order class
 */

interface ILength {
    unit: string
    value: number
}

interface IWidth {
    unit: string
    value: number
}

interface IHeight {
    unit: string
    value: number
}

interface IWeight {
    unit: string
    value: number
}

interface IProduct {
    quantity: number
    label: string
    ean: string
}

interface IPackage {
    length: ILength
    width: IWidth
    height: IHeight
    weight: IWeight
    products: IProduct[]
}

interface IBillingAddress {
    postalCode: string
    city: string
    addressLine1: string
    addressLine2: string
}

interface IDeliveryAddress {
    postalCode: string
    city: string
    addressLine1: string
    addressLine2: string
}

interface IContact {
    firstname: string
    lastname: string
    phone: string
    mail: string
    billingAddress: IBillingAddress
    deliveryAddress: IDeliveryAddress
}

interface IHeadOfficeAddress {
    postalCode: string
    city: string
    addressLine1: string
    addressLine2: string
}

interface ICarrierContact {
    firstname: string
    lastname: string
    phone: string
    mail: string
    headOfficeAddress: IHeadOfficeAddress
}

interface ICarrier {
    name: string
    contact: ICarrierContact
}

interface IOrder {
    id: number
    createdAt: string
    packages: IPackage[]
    contact: IContact
    carrier: ICarrier
}

class Order implements IOrder {
  public createdAt: string
  public packages: IPackage[]
  public contact: IContact
  public carrier: ICarrier
  public id: number

  constructor(id: number, orderData: IOrder) {
    this.createdAt = String(new Date())
    this.id = id
    this.packages = orderData.packages
    this.carrier = orderData.carrier
    this.contact = orderData.contact
  }
}

export default Order
export {Order, IOrder}

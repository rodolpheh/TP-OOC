import App from './app'
import ExampleController from './src/example/example.controller'
import OrdersController from './src/orders/orders.controller'

const app = new App([
  new ExampleController(),
  new OrdersController(),
], 1337)

app.listen()

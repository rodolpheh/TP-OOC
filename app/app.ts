import express, {Application, json} from 'express'

import errorHandler from './middlewares/errorHandler.middleware'

class App {
  public app: Application
  public port: number

  constructor(controllers: any[], port: number) {
    this.app = express()
    this.port = port

    this.initializeMiddlewares()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
  }

  public listen() {
    this.app.listen(this.port, () => {
      // tslint:disable-next-line: no-console
      console.log(`App listening on the port ${this.port}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(json())
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler)
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
  }
}

export default App

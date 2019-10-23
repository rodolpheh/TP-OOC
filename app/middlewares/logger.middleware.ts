import { NextFunction, Request, Response } from 'express'

function logger(request: Request, response: Response, next: NextFunction) {
  // tslint:disable-next-line: no-console
  console.log(`${request.method} ${request.path}`)
  next()
}

export default logger

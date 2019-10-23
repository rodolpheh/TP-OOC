/* tslint:disable no-console */
import { createClient, print } from 'redis'
import { promisify } from 'util'

const client = createClient(6379, 'redis')

client.on('connect', () => {
  console.log('Connected to Redis')
})

client.on('error', (err) => {
  console.error(`Something went wrong with Redis: ${err}`)
})

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)
const delAsync = promisify(client.del).bind(client)

export {
  getAsync,
  setAsync,
  delAsync,
}

import * as Client from '../../packages/silver'
import { rpcUrl } from './util'

const client = new Client.Client({
  ...Client.networks.testnet,
  rpcUrl,
  allowHttp: true,
})

export default client

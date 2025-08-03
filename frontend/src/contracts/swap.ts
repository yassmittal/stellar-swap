import * as Client from '../../packages/swap/dist/index'
import { rpcUrl } from './util'

const client = new Client.Client({
  ...Client.networks.testnet,
  rpcUrl,
  allowHttp: true,
})

export default client

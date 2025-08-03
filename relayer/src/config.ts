import { JsonRpcProvider } from 'ethers'
export const provider = new JsonRpcProvider('https://sepolia.infura.io/v3/', 11155111)

export const ethereumConfig = {
  chainId: 11155111,
  url: 'https://sepolia.infura.io/v3/',
  createFork: false,
  limitOrderProtocol: '',
  wrappedNative: '',
  ownerPrivateKey: '',
  blockNumber: 8844845,
  tokens: {
    USDC: {
      address: '',
      donor: '',
    },
  },
  resolverPk: '',
  resolverContractAddress: '',
  escrowFactoryContractAddress: '',
}

export const config = {
  allowedChainIds: [123],
  srcEscrowFactory: '',
  dstEscrowFactory: '',
  srcSafetyDeposit: 1 * 1e6,
  dstSafetyDeposit: 1 * 1e6,
  whitelist: [''],
}

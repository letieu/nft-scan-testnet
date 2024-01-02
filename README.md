# NftScan testnet proxy

Proxy for [https://developer.nftscan.com/](https://developer.nftscan.com/) to use on testnet.

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3078/` in your browser to see API docs.

## Run use Docker

```bash
docker run -p 3078:3078 -e 'MORALIS_API_KEY=xxx' -e 'CHAIN_ID=0x13881' letieu/nft-scan-testnet:1.4
```

env variables:
- `MORALIS_API_KEY`: Moralis API key, get it from [https://docs.moralis.io/web3-data-api/evm/get-your-api-key#step-2-get-api-key](https://docs.moralis.io/web3-data-api/evm/get-your-api-key#step-2-get-api-key)
- `CHAIN_ID`: Chain ID of the testnet, see [https://docs.moralis.io/supported-chains](https://docs.moralis.io/supported-chains)



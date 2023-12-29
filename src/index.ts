import express, { Request, Response } from 'express'
import 'dotenv/config'
import Moralis from 'moralis'
import { EvmNftCollection } from 'moralis/lib/commonEvmUtils/index';

const app = express()
const port = 3078
const chainId = process.env.CHAIN_ID

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

app.get('/account/own/:account', async (req: Request, res: Response) => {
  const { account } = req.params
  const { erc_type, contract_address, limit, cursor } = req.query

  const tokenAddresses = contract_address ? [contract_address as string] : []

  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    chain: chainId,
    format: "decimal",
    mediaItems: false,
    address: account,
    tokenAddresses: tokenAddresses,
    limit: limit ? parseInt(limit as string) : 100,
    cursor: cursor as string,
  });

  res.json({
    code: 200,
    msg: 'success',
    data: {
      total: 100, // TODO: total not correct
      next: response.raw.cursor,
      content: response.result.map((item) => ({
        "contract_address": item.tokenAddress,
        "contract_name": item.name,
        "contract_token_id": item.tokenId,
        "token_id": item.tokenId,
        "erc_type": erc_type,
        "amount": item.amount,
        "minter": item.ownerOf,
        "owner": item.ownerOf,
        "token_uri": item.tokenUri,
        "metadata_json": item.metadata,
        "name": item.name,
        "attributes": [],
      }))
    }
  });
})

app.get('/collections/own/:account', async (req: Request, res: Response) => {
  const { account } = req.params
  const { erc_type, limit, offset } = req.query

  const items: EvmNftCollection[] = [];

  while (true) {
    const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
      chain: chainId,
      address: account,
      limit: limit ? parseInt(limit as string) : 100,
    });

    items.push(...response.result.filter(
      (item) => item.contractType?.toLowerCase() === erc_type?.toString().toLowerCase())
    );

    const isEnd = !response.pagination.cursor;
    if (isEnd) break;
  }

  res.json({
    code: 200,
    msg: 'success',
    data: items.map((item) => ({
      "contract_address": item.tokenAddress,
      "name": item.name,
      "symbol": item.symbol,
      "description": item.name,
      "attributes": [],
      "erc_type": erc_type,
    }))
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

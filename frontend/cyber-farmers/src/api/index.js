import { Router, json } from 'express'
import { ec as EC } from 'elliptic'
import { Api, JsonRpc, RpcError } from 'eosjs';
import { PrivateKey, PublicKey, Signature, JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { KeyType } from 'eosjs/dist/eosjs-numeric'
import base64url from 'base64url'
import cbor from 'cbor'
import util from 'util'

import {PROJECTS} from './staticProjects'

export default () => {

  const privateKeyTokenContract = process.env.MARKET_ACCOUNT_PRIVATE_KEY
  const api = Router()
  const fetch = require('node-fetch')

  const users = {}

  const signatureProvider = new JsSignatureProvider([privateKeyTokenContract])
  const rpc = new JsonRpc(`${process.env.REACT_APP_RPC_PROTOCOL}://${process.env.API_RPC_HOST}:${process.env.REACT_APP_RPC_PORT}`, { fetch })
  const eosApi = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

  api.post('/createProject', json(), async (req, resp) => {
    const payload = req.body

    // check if token already exists
    let dgoodstats = await rpc.get_table_rows({
      json: true,
      code: 'cyfar.token',
      scope: payload.projectId,
      table: 'dgoodstats'
    });

    console.log(dgoodstats)

    if(dgoodstats.rows.find(t => t.token_name == "bond")) {
      console.log("Project already exists")
      resp.json({
        status: 'error',
        message: 'Project already exists'
      })
      return
    }

    // save the project
   

    // create project specific tokens
    const createResult = await eosApi.transact({
      actions: [{
        account: 'cyfar.token',
        name: 'create',
        authorization: [{
          actor: 'cyfar.token',
          permission: 'active',
        }],
        data: {
          issuer: "cyfar.token", 
          rev_partner: payload.partner,
          category: payload.projectId,
          token_name: "bond",
          fungible: true,
          burnable: true,
          sellable: true,
          transferable: true,
          rev_split: 0.05,
          base_uri: "https://cyberfarmers.io/" + payload.projectId,
          max_issue_days: 0,
          max_supply: payload.amount + " CYFAR"
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    })

    console.dir(createResult)

    // issue tokens to the market
    const issueResult = await eosApi.transact({
      actions: [{
        account: 'cyfar.token',
        name: 'issue',
        authorization: [{
          actor: 'cyfar.token',
          permission: 'active',
        }],
        data: {
          to: "cyfar.market",
          category: payload.projectId,
          token_name: "bond",
          quantity: payload.amount + " CYFAR",
          relative_uri: "",
          memo: "Ready for Donation"
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    })

    console.dir(issueResult)

    resp.json({
      status: 'ok',
    })
  })

  api.get('/projects', (req, resp) => {
    resp.json(PROJECTS)
  })

  return api
}

import { Router, json } from 'express'
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

import { generateCreateTokenTransaction, generateIssueTokenTransaction, generateCreateAccountTransaction } from '../utils/transaction'

import {PROJECTS} from './staticProjects'
import {VOUCHERS} from './staticVouchers'

export default () => {

  const privateKeyCyfarContract = process.env.MARKET_ACCOUNT_PRIVATE_KEY
  const privateKeySystemAccount = process.env.SYSTEM_ACCOUNT_PRIVATE_KEY
  const privateKeyTokenContract = process.env.TOKEN_ACCOUNT_PRIVATE_KEY
  
  const api = Router()
  const fetch = require('node-fetch')

  const signatureProvider = new JsSignatureProvider([privateKeyTokenContract, privateKeyCyfarContract, privateKeySystemAccount])
  const rpc = new JsonRpc(`${process.env.REACT_APP_RPC_PROTOCOL}://${process.env.API_RPC_HOST}:${process.env.REACT_APP_RPC_PORT}`, { fetch })
  const eosApi = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
  const defaultConfig = {
    blocksBehind: 3,
    expireSeconds: 30,
  }

  api.post('/createProject', json(), async (req, resp) => {
    const payload = req.body

    // check if bond token already exists
    let dgoodstats = await get_dgoodstats(payload.projectId)

    if(dgoodstats.rows.find(t => t.token_name == "bond")) {
      resp.json({
        status: 'error',
        message: 'Project already exists'
      })
      return
    }

    // save the project to some database
   

    // create project specific tokens
    const createTokenTransaction = generateCreateTokenTransaction(payload.partner, payload.projectId, "bond", payload.amount + " CYFAR")
    const createResult = await eosApi.transact(createTokenTransaction, defaultConfig)

    console.dir(createResult)

    // issue bond tokens directly to the market
    const issueTokenTransaction = generateIssueTokenTransaction("cyfar", payload.projectId, "bond", payload.amount + " CYFAR", "Ready for Donation")
    const issueResult = await eosApi.transact(issueTokenTransaction, defaultConfig)

    console.dir(issueResult)

    resp.json({
      status: 'ok',
    })
  })





  api.post('/compToken', json(), async (req, resp) => {
    const payload = req.body

    // TODO: put into single transaction
    // create project specific tokens
    const createTokenTransaction = generateCreateTokenTransaction(payload.accountName, payload.projectId, payload.token_name, payload.count + " CYFAR", false)
    const createResult = await eosApi.transact(createTokenTransaction, defaultConfig)

    // issue bond tokens directly to the market
    const issueTokenTransaction = generateIssueTokenTransaction(payload.accountName, payload.projectId, payload.token_name, payload.count + " CYFAR", "Ready for Donation")
    const issueResult = await eosApi.transact(issueTokenTransaction, defaultConfig)

    resp.json({
      status: 'ok',
    })
  })





  api.get('/projects', async (req, resp) => {

    let projects = PROJECTS
    
    // general token market info -> all available tokens for each project
    let marketAccounts = await get_accounts("cyfar")

    // get chain data for each project
    await Promise.all(projects.map(async (p) => {
      
      // dgoodstats table
      let dgoodstats = await get_dgoodstats(p.id)
      p.bondTokenInfo = dgoodstats.rows.find(dgs => dgs.token_name == "bond")

      // add available supply to the token info
      if(p.bondTokenInfo) {
        let tokenMarketInfo = marketAccounts.rows.find(acc => acc.category == p.id && acc.token_name == "bond");
        p.bondTokenInfo.available_supply = "0"
        if(tokenMarketInfo) {
          p.bondTokenInfo.available_supply = tokenMarketInfo.amount
        }
      }
      
      // asks table -> all redeemable nfts (comp tokens) for this cause
      const market_goods = await get_asks()

      // dgood table -> all existing nfts (comp tokens) for this cause
      const cause_goods = await get_dgoods(p.id, p.partner)

      // find offerable project tokens: offerable == in dgood but not in asks
      let unofferd_cause_goods = cause_goods.filter(g => market_goods.rows.find(mg => mg.batch_id == g.id) == null)
      p.existingCompTokens = unofferd_cause_goods
      // enrich with voucher data
      p.existingCompTokens.map(t => {
        t.voucher = getVoucher(t.category, t.token_name)
      })

      // filter tokens on offer to project specfic
      let market_goods_by_cause = market_goods.rows.filter(mg => cause_goods.filter(cg => cg.id == mg.batch_id).length > 0)

      // get the project id from the goods
      market_goods_by_cause = market_goods.rows.map(mg => {
        const good = cause_goods.find(g => g.id == mg.batch_id)

        if(!good) {
          return mg
        }

        mg.projectId = good.category
        mg.token_name = good.token_name

        // enrich market tokens with (currently static) voucher data 
        mg.voucher = getVoucher(good.category, good.token_name)
        
        return mg
      })

      
      
      p.redeemableCompTokens = market_goods_by_cause
      p.redeemableAmount = 0
      market_goods_by_cause.map(row => {
        p.redeemableAmount += row.dgood_ids.length * amountOf(row.amount)
      })
      
      // redeemed amount from the partner's account
      let partnerAccounts = await get_accounts(p.partner);
      let partnerBonds = partnerAccounts.rows.find(acc => acc.category == p.id && acc.token_name == "bond");
      p.redeemedAmount = 0
      if(partnerBonds) {
        p.redeemedAmount = partnerBonds.amount
      }
    }))

    resp.json(projects)
  })


  api.post('/account', json(), async (req, resp) => {
    const payload = req.body

    try {
      const creatAccountTransaction = generateCreateAccountTransaction(payload.accountName, payload.ownerKey, payload.activeKey)     
      await eosApi.transact(creatAccountTransaction, defaultConfig)

      resp.json({
        status: 'ok',
      })
    }
    catch (err) {
      resp.json({
        status: 'error',
        message: err.json.error.what
      })
    }
    
  })


  api.get('/vouchers', async (req, resp) => {
    resp.json(VOUCHERS)
  })

  const get_dgoodstats = async (scope) => rpc.get_table_rows({
    json: true,
    code: 'cyfar.token',
    scope: scope,
    table: 'dgoodstats'
  })

  const get_asks = async ()  => rpc.get_table_rows({
    json: true,
    code: 'cyfar.token',
    scope: 'cyfar.token',
    table: 'asks',
    limit: -1
  })

  const get_dgoods = async (category, owner) => {
    const data = await rpc.get_table_rows({
      json: true,
      code: 'cyfar.token',
      scope: 'cyfar.token',
      table: 'dgood',
      limit: -1
    })

    let rows = data.rows.filter(r => r.category == category)

    if(owner) {
      rows = rows.filter(r => r.owner == owner)
    }

    return rows
  }  

  const get_accounts = (scope) => rpc.get_table_rows({
    json: true,
    code: 'cyfar.token',
    scope: scope,
    table: 'accounts'
  })

  const amountOf = (asset) => asset.match(/(\d+)/)[0]

  const getVoucher = (category, token_name) => {
    let v = VOUCHERS.find(v => v.projectId == category && v.id == token_name)

    if(v)
      return v

    // default fallback as long as we have no database
    return VOUCHERS[0]
  }

  return api
}


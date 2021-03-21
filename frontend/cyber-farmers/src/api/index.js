import { Router, json } from 'express'
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

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

    // check if bond token already exists
    let dgoodstats = await get_dgoodstats(payload.projectId)

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
          base_uri: "https://cyberfarmers.org/" + payload.projectId,
          max_issue_days: 0,
          max_supply: payload.amount + " CYFAR"
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    })

    console.dir(createResult)

    // issue bond tokens directly to the market
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

  api.get('/projects', async (req, resp) => {

    let projects = PROJECTS
    
    // general token market info -> all available tokens for each project
    let marketAccounts = await get_accounts("cyfar.market")

    // get chain data for each project
    projects.forEach(async (p) => {
      
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
      
      // dgood table -> all existing nfts (comp tokens) for this cause
      let cause_comps = await get_dgoods(p.id)
      p.existingCompTokens = cause_comps.rows

      // asks table -> all redeemable nfts (comp tokens) for this cause
      let market_comps = await get_asks(p.id);
      let market_comps_by_cause = market_comps.rows.filter(comp => comp.category == p.id)
      p.redeemableCompTokens = market_comps_by_cause
      p.redeemableAmount = 0
      market_comps_by_cause.map(row => {
        p.redeemableAmount += row.dgood_ids.length * amountOf(row.amount)
      })
      
      // redeemed amount from the partner's account
      let partnerAccounts = await get_accounts(p.partner);
      let partnerBonds = partnerAccounts.rows.find(acc => acc.category == p.id && acc.token_name == "bond");
      p.redeemedAmount = 0
      if(partnerBonds) {
        p.redeemedAmount = partnerBonds.amount
      }
    })    

    console.log(projects)

    resp.json(projects)
  })

  const get_dgoodstats = async (scope) => rpc.get_table_rows({
    json: true,
    code: 'cyfar.token',
    scope: scope,
    table: 'dgoodstats'
  })

  // query comps table to see whats on offer for this 
  // const get_comps = async () => rpc.get_table_rows({
  //   json: true,
  //   code: 'cyfar.token',
  //   scope: 'cyfar.token',
  //   table: 'comps'
  // })

  const get_asks = async (category) => ({
    rows: [
      {
        dgood_ids: [101,102,103,104,105,106],
        amount: "5 CYFAR",
        seller: "farmer1",
        category: "cause1",
        expiration: "1970-01-01T00:00:00"
      }
    ]
  })

  const get_dgoods = async (category) => ({
    rows:[
      { id: 100, serial_number: "1", owner: "farmer1", category: "cause1", token_name: "voucher1", relative_url: "" },
      { id: 101, serial_number: "2", owner: "farmer1", category: "cause1", token_name: "voucher1", relative_url: "" },
      { id: 102, serial_number: "3", owner: "farmer1", category: "cause1", token_name: "voucher1", relative_url: "" },
      { id: 103, serial_number: "4", owner: "farmer1", category: "cause1", token_name: "voucher1", relative_url: "" },
      { id: 104, serial_number: "5", owner: "farmer1", category: "cause1", token_name: "voucher1", relative_url: "" },
      { id: 105, serial_number: "6", owner: "farmer1", category: "cause1", token_name: "voucher1", relative_url: "" },
      { id: 106, serial_number: "7", owner: "farmer1", category: "cause1", token_name: "voucher1", relative_url: "" },
      { id: 107, serial_number: "8", owner: "farmer1", category: "cause1", token_name: "voucher1", relative_url: "" },
    ]
  }) 

  const get_accounts = (scope) => rpc.get_table_rows({
    json: true,
    code: 'cyfar.token',
    scope: scope,
    table: 'accounts'
  })

  const amountOf = (asset) => asset.match(/(\d+)/)[0]

  return api
}


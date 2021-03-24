import { JsonRpc } from 'eosjs';
import { AnchorUser } from 'ual-anchor';
import { ScatterUser } from 'ual-scatter';
import {VOUCHERS} from '../api/staticVouchers'

const getChainUrl = () => `${process.env.REACT_APP_RPC_PROTOCOL}://${process.env.REACT_APP_RPC_HOST}:${process.env.REACT_APP_RPC_PORT}`

export const getUserInfo = async (activeUser) => {

    const accountName = await activeUser.getAccountName();

    const rpc = new JsonRpc(getChainUrl())

    // eos balance
    let eosBalance = await rpc.get_table_rows({
        json: true,                 // Get the response as json
        code: 'eosio.token',        // Contract that we target
        scope: accountName,         // Account that owns the data
        table: 'accounts'           // Table name
    })

    let eos = eosBalance.rows.find(r => r.balance.indexOf("EOS") >= 0)

    // donations
    let donations = await rpc.get_table_rows({
        json: true,                 // Get the response as json
        code: 'cyfar',        // Contract that we target
        scope: accountName,         // Account that owns the data
        table: 'donation'           // Table name
    })

    // bond tokens
    let bondTokenResult = await rpc.get_table_rows({
        json: true,                 // Get the response as json
        code: 'cyfar.token',        // Contract that we target
        scope: accountName,         // Account that owns the data
        table: 'accounts'           // Table name
    })

    bondTokenResult = bondTokenResult.rows.filter(t => t.token_name == "bond")
    let tokenInfo = bondTokenResult.map(r => ({ id: r.category, amount: r.amount, text: `${r.category}: ${r.amount}` }))

    // redeemed vouchers
    let dgoods = await rpc.get_table_rows({
        json: true,                 // Get the response as json
        code: 'cyfar.token',        // Contract that we target
        scope: 'cyfar.token',         // Account that owns the data
        table: 'dgood',           // Table name
        limit: -1
    })

    let user_dgoods = dgoods.rows.filter(dg => dg.owner == accountName)
    user_dgoods.forEach(good => {
        good.voucher = VOUCHERS.find(v => v.projectId == good.category)
    });

    let accountInfo = null
    try {
        accountInfo = await rpc.get_account(accountName)
    }
    catch(err) {}

    let userKeys = []
    if(activeUser instanceof ScatterUser) {
        userKeys = await activeUser.getKeys()
    }
    else if (activeUser instanceof AnchorUser) {
        // Anchor does not implement getKeys atm
    }      

    // create result
    const userInfo = {
        accountName,
        accountInfo,
        keys: userKeys,
        accountExists: accountInfo != null,
        eosBalance: eos != null ? eos.balance : null,
        bondTokens: tokenInfo,
        goods: user_dgoods,
        donations: donations.rows
    }

    return userInfo
}

export const amountOf = (asset) => parseInt(asset.match(/(\d+)/)[0])
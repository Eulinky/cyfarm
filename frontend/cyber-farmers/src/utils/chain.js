import { JsonRpc } from 'eosjs';

const getChainUrl = () => `${process.env.REACT_APP_RPC_PROTOCOL}://${process.env.REACT_APP_RPC_HOST}:${process.env.REACT_APP_RPC_PORT}`

export const getUserInfo = async (accountName) => {

    const rpc = new JsonRpc(getChainUrl())

    // eos balance
    let eosBalance = await rpc.get_table_rows({
        json: true,                 // Get the response as json
        code: 'eosio.token',        // Contract that we target
        scope: accountName,         // Account that owns the data
        table: 'accounts'           // Table name
    })

    let eos = eosBalance.rows.find(r => r.balance.indexOf("EOS") >= 0)


    // bond tokens
    let bondTokenResult = await rpc.get_table_rows({
        json: true,                 // Get the response as json
        code: 'cyfar.token',        // Contract that we target
        scope: accountName,         // Account that owns the data
        table: 'accounts'           // Table name
    })

    let tokenInfo = bondTokenResult.rows.map(r => ({ id: r.category, amount: r.amount, text: `${r.category}: ${r.amount}` }))

    const userInfo = {
        eosBalance: eos != null ? eos.balance : "No Data",
        bondTokens: tokenInfo
    }

    return userInfo
}
export const generateLikeTransaction = account => ({
  actions: [{
    account: 'tropical',
    name: 'like',
    authorization: [{
      actor: account,
      permission: 'active',
    }],
    data: {
      user: account,
    },
  }],
})

export const generateCreateTokenTransaction = (rev_partner, category, token_name, max_supply, fungible=true, burnable=true, sellable=true, transferable=true) => ({
  actions: [{
    account: 'cyfar.token',
    name: 'create',
    authorization: [{
      actor: 'cyfar.token',
      permission: 'active',
    }],
    data: {
      issuer: "cyfar.token", 
      rev_partner: rev_partner,
      category: category,
      token_name: token_name,
      fungible,
      burnable,
      sellable,
      transferable,
      rev_split: 0.0,
      base_uri: "https://cyberfarmers.org/" + category,
      max_issue_days: 0,
      max_supply: max_supply
    }
  }]
})

export const generateIssueTokenTransaction = (to, category, token_name, quantity, memo) => ({
  actions: [{
    account: 'cyfar.token',
    name: 'issue',
    authorization: [{
      actor: 'cyfar.token',
      permission: 'active',
    }],
    data: {
      to,
      category,
      token_name,
      quantity,
      relative_uri: "",
      memo
    }
  }]
})

export const generateDonateTransaction = (account, projectId, amount) => ({
  actions: [{
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{
      actor: account,
      permission: 'active',
    }],
    data: {
      from: account,
      to: "cyfar",
      quantity: amount,
      memo: projectId
    }
  }],
})

export const redeemVoucher = (account, batchId, quantity) => ({
  actions: [{
    account: 'cyfar.token',
    name: 'buynft',
    authorization: [{
      actor: account,
      permission: 'active'
    }],
    data: {
      from: account,
      to: 'cyfar.token',
      quantity: quantity,
      memo: `${batchId},${account}`
    }
  }]
})

export const generateListRedeemTransaction = (account, dgood_id, amount) => ({
  actions: [{
    account: 'cyfar.token',
    name: 'listredeem',
    authorization: [{
      actor: account,
      permission: 'active'
    }],
    data: {
      seller: account,
      dgood_ids: [dgood_id],
      sell_by_days: "0",
      net_sale_amount: amount
    }
  }]
})

export const generateCreateAccountTransaction = (accountName, ownKey, activeKey) => ({
  actions: [
    {
      account: 'eosio',
      name: 'newaccount',
      authorization: [{
        actor: 'eosio',
        permission: 'active',
      }],
      data: {
        creator: 'eosio',
        name: accountName,
        owner: {
          threshold: 1,
          keys: [{
            key: ownKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{
            key: activeKey,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
      }
    },
    {
      account: 'eosio',
      name: 'buyrambytes',
      authorization: [{
        actor: 'eosio',
        permission: 'active',
      }],
      data: {
        payer: 'eosio',
        receiver: accountName,
        bytes: 8192,
      },
    },
    {
      account: 'eosio',
      name: 'delegatebw',
      authorization: [{
        actor: 'eosio',
        permission: 'active',
      }],
      data: {
        from: 'eosio',
        receiver: accountName,
        stake_net_quantity: '1.0000 SYS',
        stake_cpu_quantity: '1.0000 SYS',
        transfer: false,
      }
    }
  ]
})

export const transactionConfig = { broadcast: true, expireSeconds: 30, blocksBehind: 3 }

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

export const generateCreateTokenTransaction = account => ({
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
      to: "cyfar.market",
      quantity: amount,
      memo: projectId
    }
  }],
})

export const transactionConfig = { broadcast: true, expireSeconds: 300 }

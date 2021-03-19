# Cyber Farmers
An 2021 EOSIO hackathon project about community donations to businesses on the EOSIO blockchain.

## Description
The solution provides a web frontend that allows users to donate EOS to businesses such as farmers in exchange for fungible or non-fungible bond tokens which provide for a later compensation process. For demonstration purposes a private EOS blockhain is used, so no real EOS tokens are transferred.

## Bond tokens
A detailed problem description and why bond tokens / assets can help to solve it follows soon.

## Cloud installation
The current development version can be found at https://cyfar-fe-3mtic3xe5q-ez.a.run.app/

## Requirements
In order to use the app you need

* an Anchor wallet [installation](https://greymass.com/en/anchor/download) (iOS or Desktop)
* registration of the private blockchain within Anchor
* registration of users private keys (minimum for now is donor1, keys see below)

### Registration of private blockchain
You need the private Cyber Farmers blockchain to be registered with Anchor.
Go to *Manage Blockchains*

![text](https://github.com/Eulinky/cyfarm/blob/main/documentation/anchor1.png)

and *Custom Blockchain*

![text](https://github.com/Eulinky/cyfarm/blob/main/documentation/anchor2.png)

Use these settings:

- ChainId: 8a34ec7df1b8cd06ff4a8abbaa7cc50300823350cadc59ab296cb00d104d2b8f
- Name: Cyber Farmers
- Default Node: https://cyfar-node-3mtic3xe5q-ez.a.run.app
- Default token: EOS
- Check "This blockchain is a testnet"

![text](https://github.com/Eulinky/cyfarm/blob/main/documentation/anchor3.png)

### Registration of Accounts (private Keys)
To use the frontend you need registered user accounts on the blockchain. The only way to create new accounts is to use the cleos command line tool. But there are example accounts you can use:

- donor1
- farmer1

To import these accounts into the Anchor wallet fowllow these steps:

- In Anchor go to Home Screen and click *Manage Wallets*
- Click *Import Accounts* - *Import* - *Import Manually*

Use these settings
- Account Name: *donor1* / *farmer1*
- Permission Name: *active*
- Private Key:
    - donor1: 5Ju7dkzfejtH1t4FozUdzFDPDkRgoT5pnSrW4eRhYukUBh18idL
    - farmer1: 5KkXYBUb7oXrq9cvEYT3HXsoHvaC2957VKVftVRuCy7Z7LyUcQB

![text](https://github.com/Eulinky/cyfarm/blob/main/documentation/anchor4.png)
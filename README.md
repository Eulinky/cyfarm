# Cyber Farmers
An 2021 EOSIO hackathon project about community donations to businesses on the EOSIO blockchain.

## Description
The solution provides a web frontend that allows users to donate EOS to businesses such as farmers in exchange for fungible or non-fungible bond tokens which provide for a later compensation process. For demonstration purposes a private EOS blockhain is used, so no real EOS tokens are transferred.

## CYFAR tokens
For every placed donation a donor gets back (fungible) CYFAR tokens in the same amount, locked to the specific project.
A business can issue non-fungible tokens (aka vouchers) for a specific project acting as a compensation offer to donors.
Donors can use their CYFAR tokens to purchase offers. In the future, these tokens can be transferred and used to perform other activities such as voting or promoting for example.

## Cloud installation
The current development version can be found at https://www.cyberfarmer.org

## Requirements
In order to use the app you need

* an Anchor wallet [installation](https://greymass.com/en/anchor/download) (iOS or Desktop)
* [registration](https://github.com/Eulinky/cyfarm/blob/main/documentation/wallet.md) of the private blockchain within Anchor
* [registration](https://github.com/Eulinky/cyfarm/blob/main/documentation/wallet.md) of user accounts / private keys

## Running locally
You can run app and blockchain locally using docker. I'll add a docker-compose later.

You need a common network

`docker network create cyfar`

### Blockchain Node
`cd eos`

`docker build -t cyfar-node .`

`docker run --rm -d --name cyfar-node -p 8888:8888 -p 9876:9876 --network cyfar cyfar-node`

### Frontend (Docker)
`cd frontend/cyber-farmers`

`docker build -t cyfar-fe:latest .`

`docker run -it -p 3001:3000 --rm --name cyfar-fe --network cyfar cyfar-fe:latest`

### Frontend (node)
If you make changes to the frontend it's better to a local dev server. You need nodejs and yarn installed.

`cd frontend/cyber-farmers`

`yarn` or `npm install` 

`yarn start` or `npm run start`

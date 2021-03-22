# Cyber Farmers
An 2021 EOSIO hackathon project about community donations to businesses on the EOSIO blockchain.

## Description
The solution provides a web frontend that allows users to donate EOS to businesses such as farmers in exchange for fungible or non-fungible bond tokens which provide for a later compensation process. For demonstration purposes a private EOS blockhain is used, so no real EOS tokens are transferred.

## Bond tokens
A detailed problem description and why bond tokens / assets can help to solve it follows soon.

## Cloud installation
The current development version can be found at https://cyfar-fe-3mtic3xe5q-ez.a.run.app/
Updated by Alex: https://www.cyberfarmer.org

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

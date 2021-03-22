## Initiate local Blockchain

### Initiate wallet and accounts
* cyfar.token account
* cyfar account
* farmer1 account
* donor1 account

### Add code permission to cyfar account
`cleos set account permission cyfar active --add-code`

### Deploy cyberfarmer.token contract

`cleos set contract cyfar.token ~/projects/dgoods/build/dgoods/ dgoods.wasm dgoods.abi`

# Project Creation
### Publish CYFAR bond token symbol

`cleos push action cyfar.token setconfig '{"symbol": "CYFAR", "version": "1.0"}' -p cyfar.token@active`

### Create CYFAR bond tokens for a specific cause
`cleos push action cyfar.token create '{"issuer": "cyfar.token", 
                                       "rev_partner": "farmer1",
                                       "category": "cause1",
                                       "token_name": "bond",
                                       "fungible": true,
                                       "burnable": true,
                                       "sellable": true,
                                       "transferable": true,
                                       "rev_split": 0.0,
                                       "base_uri": "https://cyberfarmers.org/cause1/bond/",
                                       "max_issue_days": 0,
                                       "max_supply": "1000 CYFAR"}' -p cyfar.token`

### Create project specific compensation token which can be offered to the donors later
`cleos push action cyfar.token create '{"issuer": "cyfar.token", 
                                       "rev_partner": "farmer1",
                                       "category": "cause1",
                                       "token_name": "voucher1",
                                       "fungible": false,
                                       "burnable": false,
                                       "sellable": false,
                                       "transferable": true,
                                       "rev_split": 0.0,
                                       "base_uri": "https://cyberfarmers.org/cause1/comp/",
                                       "max_issue_days": 0,
                                       "max_supply": "100 CYFAR"}' -p cyfar.token`
                    
### Issue the bond tokens to the market
`cleos push action cyfar.token issue '{"to": "cyfar",
                                      "category": "cause1",
                                      "token_name": "bond",
                                      "quantity": "1000 CYFAR",
                                      "relative_uri": "",
                                      "memo": "Ready for donation!"}' -p cyfar.token`

### Issue the compensation tokens to the farmer to put them later on market
`cleos push action cyfar.token issue '{"to": "farmer1",
                                      "category": "cause1",
                                      "token_name": "voucher1",
                                      "quantity": "50 CYFAR",
                                      "relative_uri": "",
                                      "memo": "Vouchers for later compensation!"}' -p cyfar.token`

### Check that token has been issued to cyfar
`cleos get table cyfar.token cyfar accounts`

# Donation Phase                                            

### Issue some EOS to the donor1 for donation purpose
`cleos transfer eosio donor1 "1000.0000 EOS"`

### Donate by sending EOS to the market, specifying the target in the memo!
`cleos push action eosio.token transfer '{"from": "donor1",
                                            "to": "cyfar",
                                            "quantity": "5.0000 EOS",
                                            "memo": "cause1"}' -p donor1@active`


### Check that donor owns bond tokens of the right project now
`cleos get table cyfar.token donor1 accounts`

### Get detail infos for a category (rev_partner, token_name)
`cleos get table cyfar.token concert1 dgoodstats`

# Compensation Phase

### Transfer some compensation tokens to the market so that donors can choose a compensation
´cleos push action cyfar.token transferft '{"from": "farmer1",
                                            "to": "cyfar",
                                            "category": "cause1",
                                            "token_name": "voucher",
                                            "quantity": "500 CYFAR",
                                            "memo": "Compensations available!"}' -p farmer1@active´


# Google Cloud

## Image Local

`docker tag cyfar-fe gcr.io/cyberfarmer/cyfar-fe`

`docker push gcr.io/cyberfarmer/cyfar-fe`

## Image Cloud
`cd into folder with Dockerfile`

`gcloud builds submit --tag gcr.io/cyberfarmer/cyfar-node`

## Google Run


`gcloud run deploy cyfar-fe --image=gcr.io/cyberfarmer/cyfar-fe --platform=managed --port=3000 --region="europe-west4" --timeout="60" --memory="2Gi"`

`gcloud run deploy cyfar-node --image=gcr.io/cyberfarmer/cyfar-node --platform=managed --port=8888 --region="europe-west4" --timeout="30" --memory="4Gi"`

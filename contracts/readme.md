## About

## Initiate local Blockchain

### Initiate wallet and accounts
* cyfar.token account
* cyfar.market account
* business1 account
* donor1 account

### Add code permission to cyfar.market account
´cleos set account permission cyfar.market active --add-code´

### Deploy cyberfarmer.token contract

´cleos set contract cyfar.token ~/projects/dgoods/build/dgoods/ dgoods.wasm dgoods.abi´

### publish CYFAR bond token symbol

´cleos push action cyfar.token setconfig '{"symbol": "CYFAR", "version": "1.0"}' -p cyfar.token@active´

### create SYFAR tokens for a specific cause

´cleos push action cyfar.token create '{"issuer": "cyfar.token", 
                                       "rev_partner": "business1",
                                       "category": "cause1",
                                       "token_name": "bond",
                                       "fungible": true,
                                       "burnable": true,
                                       "sellable": true,
                                       "transferable": true,
                                       "rev_split": 0.05,
                                       "base_uri": "https://cyberfarmers.io/cause1/bond/",
                                       "max_issue_days": 0,
                                       "max_supply": "1000 CYFAR"}' -p cyfar.token´

### create an equal amount of donation tokens for that specific cause which donors can buy (get in return for a donation)
´cleos push action cyfar.token create '{"issuer": "cyfar.token", 
                                       "rev_partner": "business1",
                                       "category": "cause1",
                                       "token_name": "donation",
                                       "fungible": true,
                                       "burnable": false,
                                       "sellable": false,
                                       "transferable": true,
                                       "rev_split": 0.05,
                                       "base_uri": "https://cyberfarmers.io/cause2/donation/",
                                       "max_issue_days": 0,
                                       "max_supply": "1000 CYFAR"}' -p cyfar.token´
                    

### issue the bond tokens to the business
´cleos push action cyfar.token issue '{"to": "business1",
                                      "category": "cause1",
                                      "token_name": "bond",
                                      "quantity": "1000 CYFAR",
                                      "relative_uri": "",
                                      "memo": "Good luck!"}' -p cyfar.token´

### Check that token has been issued to business1
´cleos get table cyfar.token business1 accounts´

### transfer bond tokens to the market so people can "buy" them
´cleos push action cyfar.token transferft '{"from": "business1",
                                            "to": "cyfar.market",
                                            "category": "cause1",
                                            "token_name": "bond",
                                            "quantity": "500 CYFAR",
                                            "memo": "Donation box is open!"}' -p business1@active´


## Donation Phase                                            

### issue some donation tokens to the donor (as a result of a successful payment)
´cleos push action cyfar.token issue '{"to": "donor1",
                                      "category": "cause1",
                                      "token_name": "donation",
                                      "quantity": "25 CYFAR",
                                      "relative_uri": "",
                                      "memo": "Thanks for your donation payment!"}' -p cyfar.token´

### Check that token has been issued to business1
´cleos get table cyfar.token donor1 accounts´

### transfer donation tokens to the market to buy the bonds
´cleos push action cyfar.token transferft '{"from": "donor1",
                                            "to": "cyfar.market",
                                            "category": "cause1",
                                            "token_name": "donation",
                                            "quantity": "2 CYFAR",
                                            "memo": "Hope that helps!"}' -p donor1@active´


### get all categories
´cleos get table cyfar.token cyfar.token categoryinfo´

### get detail infos for a category (rev_partner, token_name)
´cleos get table cyfar.token concert1 dgoodstats´
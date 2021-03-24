#!/usr/bin/env bash
set -m

SYSTEM_ACCOUNT_PRIVATE_KEY="5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
SYSTEM_ACCOUNT_PUBLIC_KEY="EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"

EOSIO_TOKEN_ACCOUNT_PRIVATE_KEY="5KTP54vJVMBx1nKFHgkziULVSXLdMmWR2FFiSPAuyoA9craU7Rv"
EOSIO_TOKEN_ACCOUNT_PUBLIC_KEY="EOS5hwoFmW2do6WjaXAJDmTiFAvGYXvUpj532P3FXdJmKTV7MWeS3"

REX_TOKEN_ACCOUNT_PRIVATE_KEY="5KU8nomv5ouVGoWL8t41Fsjv1yu5gDSNWFqskpmwdFBnSCuiuEs"
REX_TOKEN_ACCOUNT_PUBLIC_KEY="EOS5DmM3zdzUSADWzB2AkRnAPAuxoPD2y1pEXFyhd9RUHnyj5a35E"

RAM_TOKEN_ACCOUNT_PRIVATE_KEY="5KbhpRjW2brcUTjJ68CktLwWcVpU3LjE9oHP4VXa8hZVs9RmVk4"
RAM_TOKEN_ACCOUNT_PUBLIC_KEY="EOS5rP1ZkqZ9uL5Z3RJ1BfFyg51iP9nizrqkm8LStYDXnKN5AnLrV"

# example accounts for test only
TOKEN_ACCOUNT_PRIVATE_KEY="5KKJnVF6xtmBqo5CP3j1b9GnpyRxbH9Mzft4jTrob7sdZ9CKYrm"
TOKEN_ACCOUNT_PUBLIC_KEY="EOS6tUtRBRVXpBgh8WRUXPbEHQXWAhK9ab4BwGdfDhKK5gGbUdVzu"

CYFAR_ACCOUNT_PRIVATE_KEY="5Jh6jf9g1UzcWrMMsgqd5GrTCgzeKkh5yT7EUZbiU7wB7k4Ayx1"
CYFAR_ACCOUNT_PUBLIC_KEY="EOS6bRs6knaaHyvpVXd5EgAPoxrZkkeDv89M1jidHCt86W5rkwr1q"

FARMER_ACCOUNT_PRIVATE_KEY="5KkXYBUb7oXrq9cvEYT3HXsoHvaC2957VKVftVRuCy7Z7LyUcQB"
FARMER_ACCOUNT_PUBLIC_KEY="EOS6TWM95TUqpgcjYnvXSK5kBsi6LryWRxmcBaULVTvf5zxkaMYWf"

DONOR_ACCOUNT_PRIVATE_KEY="5Ju7dkzfejtH1t4FozUdzFDPDkRgoT5pnSrW4eRhYukUBh18idL"
DONOR_ACCOUNT_PUBLIC_KEY="EOS4vQ5efYXZYFF12868QZyZgT9YKMZivdETfRuejisZJpEq723aF"

ROOT_DIR="/opt/eosio"
CONTRACTS_DIR="$ROOT_DIR/bin/contracts"
BLOCKCHAIN_DATA_DIR=/root/.local/share
BLOCKCHAIN_CONFIG_DIR=/opt/eosio/bin/config-dir
WALLET_DIR="/root/eosio-wallet/"

mkdir -p $ROOT_DIR/bin

# Set PATH
PATH="$PATH:$ROOT_DIR/bin:$ROOT_DIR/bin/scripts"
CONFIG_DIR="$ROOT_DIR/bin/config-dir"

function create_wallet {
  echo "Starting the wallet"
  rm -rf $WALLET_DIR
  mkdir -p $WALLET_DIR
  nohup keosd --unlock-timeout 999999999 --wallet-dir $WALLET_DIR --http-server-address 127.0.0.1:8900 2>&1 &
  sleep 1s
  wallet_password=$(cleos wallet create --to-console | awk 'FNR > 3 { print $1 }' | tr -d '"')
  echo $wallet_password > "$CONFIG_DIR/keys/default_wallet_password.txt"

  cleos wallet import --private-key $SYSTEM_ACCOUNT_PRIVATE_KEY
}

# $1 account name
# $2 contract name
function setcontract {
  retry_count="4"

  cd $CONTRACTS_DIR
  while [ $retry_count -gt 0 ]; do
    cleos set contract $1 . "$2.wasm" "$2.abi" -p $1@active
    if [ $? -eq 0 ]; then
      break
    fi

    echo "setcontract failed retrying..."
    sleep 1s
    retry_count=$[$retry_count-1]
  done

  if [ $retry_count -eq 0 ]; then
    echo "setcontract failed too many times, bailing."
    exit 1
  fi
}

# $1 - account name
# $2 - public key
# $3 - private key
function create_account {
  cleos wallet import --private-key $3
  cleos create account eosio $1 $2 $2
}

# $1 - contract name
# $2 - target account name
function deploy_contract {
  # Unlock the wallet, ignore error if already unlocked
  cleos wallet unlock --password $(cat "$CONFIG_DIR"/keys/default_wallet_password.txt) || true

  echo "Deploying the $1 contract"

  cd "$CONTRACTS_DIR/"
  (
    if [ ! -f "$1.wasm" ]; then
      eosio-cpp -abigen "$1.cpp" -o "$1.wasm" -I ./
    else
      echo "Using pre-built contract..."
    fi
  ) &&
  # Move back into the executable directory
  cd $CONTRACTS_DIR

  # Set (deploy) the compiled contract to the blockchain
  setcontract $2 $1 
}

# $1 - parent folder where smart contract directory is located
# $2 - smart contract name
# $3 - version
function deploy_eos_contract {
  # Unlock the wallet, ignore error if already unlocked
  cleos wallet unlock --password $(cat "$CONFIG_DIR"/keys/default_wallet_password.txt) || true

  path=$CONTRACTS_DIR/$3/build
  echo "Deploying the $2 contract from path: $path"

  # Move into contracts /src directory
  cd $path

  # Set (deploy) the compiled contract to the blockchain
  cleos set contract $1 . "$2.wasm" "$2.abi" -p $1@active

  # Move back into the executable directory
  cd $CONTRACTS_DIR
}

function issue_eos_tokens {
  echo "Issuing EOS tokens"
  cleos push action eosio.token create '["eosio", "10000000000.0000 EOS"]' -p eosio.token
  cleos push action eosio.token create '["eosio", "10000000000.0000 SYS"]' -p eosio.token

  cleos push action eosio.token issue '["eosio", "5000000000.0000 EOS", "Half of available supply"]' -p eosio
  cleos push action eosio.token issue '["eosio", "5000000000.0000 SYS", "Half of available supply"]' -p eosio
}

# Move into the executable directory
cd $ROOT_DIR/bin/
mkdir -p $CONFIG_DIR
mkdir -p $BLOCKCHAIN_DATA_DIR
mkdir -p $BLOCKCHAIN_CONFIG_DIR
mkdir -p "$CONFIG_DIR/keys"

echo "Starting the chain for setup"
nodeos -e -p eosio \
--data-dir $BLOCKCHAIN_DATA_DIR \
--config-dir $BLOCKCHAIN_CONFIG_DIR \
--http-validate-host=false \
--plugin eosio::producer_api_plugin \
--plugin eosio::chain_api_plugin \
--plugin eosio::http_plugin \
--http-server-address=0.0.0.0:8888 \
--access-control-allow-origin=* \
--contracts-console \
--max-transaction-time=100000 \
--verbose-http-errors & >> nodeos.log

echo "Waiting for the chain to finish startup"
until curl localhost:8888/v1/chain/get_info
do
  echo "Still waiting"
  sleep 1s
done

# Activate PREACTIVATE_FEATURE
echo "Activate PREACTIVATE_FEATURE"
curl -X POST http://127.0.0.1:8888/v1/producer/schedule_protocol_feature_activations -d '{"protocol_features_to_activate": ["0ec7e080177b2c02b278d5088611686b49d739925a92d9bfcacd7fc6b74053bd"]}'
sleep 2s

echo "Creating accounts and deploying contracts"
create_wallet

echo "deploy OLD contract to enable WTMSIG"
deploy_eos_contract eosio eosio.bios 1.8
sleep 2s

create_account eosio.token $EOSIO_TOKEN_ACCOUNT_PUBLIC_KEY $EOSIO_TOKEN_ACCOUNT_PRIVATE_KEY
create_account eosio.rex $REX_TOKEN_ACCOUNT_PUBLIC_KEY $REX_TOKEN_ACCOUNT_PRIVATE_KEY
create_account eosio.ram $RAM_TOKEN_ACCOUNT_PUBLIC_KEY $RAM_TOKEN_ACCOUNT_PRIVATE_KEY
create_account cyfar.token $TOKEN_ACCOUNT_PUBLIC_KEY $TOKEN_ACCOUNT_PRIVATE_KEY
create_account cyfar $CYFAR_ACCOUNT_PUBLIC_KEY $CYFAR_ACCOUNT_PRIVATE_KEY
create_account farmer1 $FARMER_ACCOUNT_PUBLIC_KEY $FARMER_ACCOUNT_PRIVATE_KEY
create_account donor1 $DONOR_ACCOUNT_PUBLIC_KEY $DONOR_ACCOUNT_PRIVATE_KEY

create_account eosio.bpay EOS6Z1vacRKpPq9f4VpGHwd8eXPKC5W85BCLXDvxZA195JbMUdUvb 5KFtMF12LfN2KFnBr5zJZuHFo8ftzbqn68zUKJ88zoAy73Rd5HE
create_account eosio.msig EOS53Yv6vp7YPzyJ3DQTGYLv47yTbDEB8Qqwj8m5ujvdxKeaMgCPh 5JnS7RgGkrTwTfKGRqBotq4uRySShLEM8XpeACFWWBTaW2S9mQe
create_account eosio.names EOS7XA5sCnAQocrh6E6BgDmY2EMspefntWHQykXjuA58kAfXWcvMc 5K9KhXjDTsKCpZc8xCqzEJAAD4wntTxPytykS15vuL3iMgVsrrF
create_account eosio.ramfee EOS7jxcBymP4byRn4SvgWQqHeSytgDxDZeA4hwsUeJ5UVWNuu2yd4 5Kg6vFtsMfF4tWQDE2dQgTyjhS3jFHS57zVeHHq6iwZ9KY56zf4
create_account eosio.saving EOS5bQvx5ZTxMaSMZnYSA6avbtWdGpx3bGt3GCA8XAK3vHfyZfqkP 5JN86aMk9xC8ykkXxLc2633fqNtv9w7BmGtF3CPrbtnKwsYbDWr
create_account eosio.stake EOS8d3F3ovcFuWLvoqtMq14QScZ1STC2FG7inT5mAi1bohvj4H79J 5J9LSYyiWXBjYVG99G6Lu7JuJEAoedMUmLsF9gfgr3mfJcgGHwM
create_account eosio.vpay EOS6dtHmZhsHSTUtyizWa2UB7cpwjpt9jwC3Jh4pLzx5RGzWShgog 5JGx4Y3TgFtezr3SJ59HR1H9wbbDiQPeYvTs3F5qxGE34KF4n2C

echo "Activate WTMSIG_BLOCK_SIGNATURES"
cleos -u http://127.0.0.1:8888 push transaction '{"delay_sec":0,"max_cpu_usage_ms":0,"actions":[{"account":"eosio","name":"activate","data":{"feature_digest":"299dcb6af692324b899b39f16d5a530a33062804e41f09dc97e9f156b4476707"},"authorization":[{"actor":"eosio","permission":"active"}]}]}'
sleep 2s

echo "remove old contract and set 1.9"
cleos set contract --clear eosio
sleep 2s

echo "Deploy eosio.bios 1.9"
deploy_eos_contract eosio eosio.bios 1.9
sleep 2s

echo "Deploy eosio.system 1.9"
deploy_eos_contract eosio eosio.system 1.9
sleep 2s

echo "Deploy eosio.token 1.9"
deploy_eos_contract eosio.token eosio.token 1.9

issue_eos_tokens
cleos push action eosio init '["0", "4,SYS"]' -p eosio@active

deploy_contract cyfartoken cyfar.token
cleos set account permission cyfar.token active --add-code
cleos push action cyfar.token setconfig '{"symbol": "CYFAR", "version": "1.0"}' -p cyfar.token@active

deploy_contract cyfar cyfar
cleos set account permission cyfar active --add-code
cleos transfer eosio donor1 "1000.0000 EOS"

# ===== create bond token for farmer1::cause1
cleos push action cyfar.token create '{"issuer": "cyfar.token", "rev_partner": "farmer1", "category": "cause1", "token_name": "bond", "fungible": true, "burnable": true, "sellable": true, "transferable": true,"rev_split": 0.0, "base_uri": "https://cyberfarmers.org/cause1/bond/", "max_issue_days": 0, "max_supply": "1000 CYFAR"}' -p cyfar.token@active
cleos push action cyfar.token issue '{"to": "cyfar", "category": "cause1", "token_name": "bond", "quantity": "1000 CYFAR", "relative_uri": "", "memo": "Ready for donation!"}' -p cyfar.token

# ===== create voucher token for farmer1::cause1
cleos push action cyfar.token create '{"issuer": "cyfar.token", "rev_partner": "farmer1", "category": "cause1", "token_name": "voucher1", "fungible": false, "burnable": false, "sellable": true, "transferable": true, "rev_split": 0.0, "base_uri": "https://cyberfarmers.org/cause1/comp/", "max_issue_days": 0, "max_supply": "100 CYFAR"}' -p cyfar.token
cleos push action cyfar.token issue '{"to": "farmer1", "category": "cause1", "token_name": "voucher1", "quantity": "50 CYFAR", "relative_uri": "", "memo": "Vouchers for later compensation!"}' -p cyfar.token

# put some vouchers on the market
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [1], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [2], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [3], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [4], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [5], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [6], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [7], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [8], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [9], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active
cleos push action cyfar.token listredeem '{"seller": "farmer1", "dgood_ids": [10], "sell_by_days": "0", "net_sale_amount": "5 CYFAR"}' -p farmer1@active

# donate 20 EOS to a cause to get bond tokens
cleos transfer donor1 cyfar "20.0000 EOS" "cause1" -p donor1@active
cleos transfer donor1 cyfar "5.0000 EOS" "cause1" -p donor1@active

# redeem 5 CYFAR for one voucher
cleos push action cyfar.token buynft '{"from": "donor1", "to": "cyfar.token", "quantity": "5 CYFAR", "memo": "1,donor1"}' -p donor1@active


echo "All done initializing the blockchain"

echo "Shut down Nodeos, sleeping for 2 seconds to allow time for at least 4 blocks to be created after deploying contracts"
sleep 2s
kill %1
fg %1
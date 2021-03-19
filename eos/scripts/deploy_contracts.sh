#!/usr/bin/env bash
set -m

SYSTEM_ACCOUNT_PRIVATE_KEY="5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
SYSTEM_ACCOUNT_PUBLIC_KEY="EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"

# example accounts for test only
TOKEN_ACCOUNT_PRIVATE_KEY="5KKJnVF6xtmBqo5CP3j1b9GnpyRxbH9Mzft4jTrob7sdZ9CKYrm"
TOKEN_ACCOUNT_PUBLIC_KEY="EOS6tUtRBRVXpBgh8WRUXPbEHQXWAhK9ab4BwGdfDhKK5gGbUdVzu"

MARKET_ACCOUNT_PRIVATE_KEY="5Jh6jf9g1UzcWrMMsgqd5GrTCgzeKkh5yT7EUZbiU7wB7k4Ayx1"
MARKET_ACCOUNT_PUBLIC_KEY="EOS6bRs6knaaHyvpVXd5EgAPoxrZkkeDv89M1jidHCt86W5rkwr1q"

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
# $3 - account name
function deploy_eos_contract {
  # Unlock the wallet, ignore error if already unlocked
  cleos wallet unlock --password $(cat "$CONFIG_DIR"/keys/default_wallet_password.txt) || true

  path=$CONTRACTS_DIR/eosio.contracts/contracts/$2/src
  echo "Deploying the $2 contract in path: $path"

  # Move into contracts /src directory
  cd $path

  # Compile the smart contract to wasm and abi files using the EOSIO.CDT (Contract Development Toolkit)
  # https://github.com/EOSIO/eosio.cdt
  eosio-cpp -abigen "$2.cpp" -o "$2.wasm" -I ../include

  # Set (deploy) the compiled contract to the blockchain
  cleos set contract $1 . "$2.wasm" "$2.abi" -p $1@active

  # Move back into the executable directory
  cd $CONTRACTS_DIR
}

function issue_eos_tokens {
  echo "Issuing EOS tokens"
  cleos push action eosio.token create '["eosio", "10000000000.0000 EOS"]' -p eosio.token
  cleos push action eosio.token issue '["eosio", "5000000000.0000 EOS", "Half of available supply"]' -p eosio
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

echo "Creating accounts and deploying contracts"
create_wallet

echo "INSTALLING CONTRACTS"

# eosio.token
create_account eosio.token $SYSTEM_ACCOUNT_PUBLIC_KEY $SYSTEM_ACCOUNT_PRIVATE_KEY
deploy_eos_contract eosio.token eosio.token
issue_eos_tokens

# cyfar.token (dgoods)
create_account cyfar.token $TOKEN_ACCOUNT_PUBLIC_KEY $TOKEN_ACCOUNT_PRIVATE_KEY
deploy_contract dgoods cyfar.token

# publish CYFAR bond token symbol
cleos push action cyfar.token setconfig '{"symbol": "CYFAR", "version": "1.0"}' -p cyfar.token@active

# cyfar.market
create_account cyfar.market $MARKET_ACCOUNT_PUBLIC_KEY $MARKET_ACCOUNT_PRIVATE_KEY
deploy_contract cyfarmarket cyfar.market
cleos set account permission cyfar.market active --add-code

# farmer
create_account farmer1 $FARMER_ACCOUNT_PUBLIC_KEY $FARMER_ACCOUNT_PRIVATE_KEY

# donor
create_account donor1 $DONOR_ACCOUNT_PUBLIC_KEY $DONOR_ACCOUNT_PRIVATE_KEY
cleos transfer eosio donor1 "1000.0000 EOS"

# publish CYFAR bond token symbol
cleos push action cyfar.token setconfig '{"symbol": "CYFAR", "version": "1.0"}' -p cyfar.token@active

echo "All done initializing the blockchain"

echo "Shut down Nodeos, sleeping for 2 seconds to allow time for at least 4 blocks to be created after deploying contracts"
sleep 2s
kill %1
fg %1
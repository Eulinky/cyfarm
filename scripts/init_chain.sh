#!/bin/bash

wallet_name="cyfarm"
wallet_path="~/eosio-wallet/$wallet_name.wallet"

deploy_account_script_name="deploy_accounts.sh"

# create wallet
rm $wallet_path
output=$(cleos wallet create -n $wallet_name --to-console)

while read -r line; do
    if [[ $line = \"* ]]
    then
        wallet_pw=$(echo "$line" | sed 's/"//g')
    fi
done <<< "$output"

create_account() {
    account_name=$1

    # create keys
    output=$(cleos create key --to-console)

    # store keys to variables
    while read -r line; do
        if [[ $line = Private* ]]
        then
            private_key=$(echo "$line" | sed 's/^Private key:.//')
        fi
        if [[ $line = Public* ]]
        then
            public_key=$(echo "$line" | sed 's/^Public key:.//')
        fi
    done <<< "$output"

    # import private key to wallet
    cleos wallet import -n $wallet_name --private-key $private_key

    echo "cleos create account eosio $account_name $public_key $public_key" >> "./$deploy_account_script_name"
}

# import eosio default account key
cleos wallet import -n $wallet_name --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3 >/dev/null

rm "./$deploy_account_script_name"
echo "#!/bin/bash" > "./$deploy_account_script_name"
echo "" >> "./$deploy_account_script_name"

create_account "cyfar.token"
create_account "cyfar"
create_account "business1"
create_account "donor1"

# run the create accoutns script
chmod +x "./$deploy_account_script_name"
./$deploy_account_script_name

echo $wallet_pw > /home/eule/projects/cyber-farmers/$wallet_name.password
#cp ~/eosio-wallet/./$wallet_name.wallet $wallet_path

# Add code permission to cyfar account
cleos set account permission cyfar active --add-code

# Deploy cyberfarmer.token contract
cleos set contract cyfar.token ~/projects/dgoods/build/dgoods/ dgoods.wasm dgoods.abi

# publish CYFAR bond token symbol
cleos push action cyfar.token setconfig '{"symbol": "CYFAR", "version": "1.0"}' -p cyfar.token@active
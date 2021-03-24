cd /usr/opt/eosio.contracts

# start build
./build.sh -c /usr/opt/eosio.cdt

# copy results
cp build/contracts/eosio.bios/eosio.bios.abi /usr/opt/build-output
cp build/contracts/eosio.bios/eosio.bios.wasm /usr/opt/build-output

cp build/contracts/eosio.system/eosio.system.abi /usr/opt/build-output
cp build/contracts/eosio.system/eosio.system.wasm /usr/opt/build-output

cp build/contracts/eosio.msig/eosio.msig.abi /usr/opt/build-output
cp build/contracts/eosio.msig/eosio.msig.wasm /usr/opt/build-output

cp build/contracts/eosio.token/eosio.token.abi /usr/opt/build-output
cp build/contracts/eosio.token/eosio.token.wasm /usr/opt/build-output

cp build/contracts/eosio.wrap/eosio.wrap.abi /usr/opt/build-output
cp build/contracts/eosio.wrap/eosio.wrap.wasm /usr/opt/build-output
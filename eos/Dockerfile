FROM ubuntu:18.04

EXPOSE 8888/tcp
EXPOSE 9876/tcp

RUN echo "INSTALLING EOSIO AND CDT"
RUN apt-get update && apt-get install -y wget sudo curl
RUN wget https://github.com/eosio/eosio.cdt/releases/download/v1.7.0/eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb
RUN apt-get update && sudo apt install -y ./eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb
RUN rm ./eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb

RUN wget https://github.com/eosio/eos/releases/download/v2.0.9/eosio_2.0.9-1-ubuntu-18.04_amd64.deb
RUN apt-get update && sudo apt install -y ./eosio_2.0.9-1-ubuntu-18.04_amd64.deb
RUN rm ./eosio_2.0.9-1-ubuntu-18.04_amd64.deb

RUN echo "COPY EOSIO.CONTRACTS"
RUN mkdir -p "/opt/eosio/bin/contracts"

RUN wget https://github.com/EOSIO/eosio.contracts/archive/v1.9.2.tar.gz
RUN mkdir -p /eosio.contracts
RUN tar xvzf ./v1.9.2.tar.gz -C /eosio.contracts
RUN mv /eosio.contracts/eosio.contracts-1.9.2 /opt/eosio/bin/contracts
RUN mv /opt/eosio/bin/contracts/eosio.contracts-1.9.2 /opt/eosio/bin/contracts/eosio.contracts

RUN echo "COPY APP CONTRACTS"
COPY . /opt/eosio/bin

RUN mkdir -p "/opt/eosio/bin/config-dir"

RUN /bin/bash /opt/eosio/bin/scripts/deploy_contracts.sh

CMD ["-e", "-p", "eosio", "-d", "/root/.local/share", "--plugin", "eosio::producer_plugin", "--plugin", "eosio::chain_api_plugin", "--plugin", "eosio::http_plugin", "--http-server-address=0.0.0.0:8888", "--access-control-allow-origin=*", "--contracts-console", "--http-validate-host=false", "--verbose-http-errors", "--max-transaction-time=100"]
ENTRYPOINT [ "nodeos" ]

FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y \
    curl \
    wget \
    sudo \
    curl \
    cmake \
    build-essential \
    git

# install eos contract development toolkit
RUN wget https://github.com/eosio/eosio.cdt/releases/download/v1.7.0/eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb
RUN apt-get update && sudo apt install -y ./eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb
RUN rm ./eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb

# get latest
WORKDIR /usr/opt/
RUN git clone https://github.com/EOSIO/eosio.contracts.git

# create result dir holding just wasm and abis
RUN mkdir -p /usr/opt/build-output

# copy entry point
WORKDIR /usr/opt/eosio.contracts
COPY run_build.sh .
RUN chmod +x run_build.sh

CMD [ "sh", "./run_build.sh" ]
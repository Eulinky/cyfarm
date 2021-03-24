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
RUN wget https://github.com/EOSIO/eosio.cdt/releases/download/v1.6.3/eosio.cdt_1.6.3-1-ubuntu-18.04_amd64.deb
RUN apt install ./eosio.cdt_1.6.3-1-ubuntu-18.04_amd64.deb
RUN rm ./eosio.cdt_1.6.3-1-ubuntu-18.04_amd64.deb

WORKDIR /usr/opt/
RUN git clone https://github.com/EOSIO/eosio.contracts.git

# get Version 1.8.3
WORKDIR /usr/opt/eosio.contracts
RUN git checkout v1.8.3-inline-msig-patch3

# create result dir holding just wasm and abis
RUN mkdir -p /usr/opt/build-output

# copy entry point
COPY run_build.sh .
RUN chmod +x run_build.sh

CMD [ "sh", "./run_build.sh" ]
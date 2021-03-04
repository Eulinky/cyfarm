#!/bin/bash

img_name=nodeos-2.0.9
container_name=nodeos

# runs a local eos node which is accessible via local cleos
docker run --rm --name $container_name -d -it --net=eos -p 8888:8888 -p 9876:9876 $img_name

docker logs $container_name
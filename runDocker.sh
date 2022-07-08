#!/bin/bash

# Remove o container, se existir
docker stop node-express
docker container rm node-express

# Gera o container
docker run --name node-express -p 3000:3000

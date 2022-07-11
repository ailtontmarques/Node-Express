#!/bin/bash

# Remove o container, se existir
docker stop nodeexpress
docker container rm nodeexpress

# Gera o container
docker run --publish 3000:3000 nodeexpress

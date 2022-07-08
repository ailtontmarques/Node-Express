# Recomendador de amigos
Teste app Node.js com Express - persistence into file JSON

## Para a instalação

1. clone o repositório `https://github.com/ailtontmarques/[completar-informacao]]`
2. Entre no projeto e instale as dependencias `npm install`

## Ambiente Local

Execute `node index` para que o projeto suba localmente. Acesse a url `http://localhost:3000/`.

## Acesso aos métodos via PostMan

Importe o arquivo `Ambiente ...json` para acessar as chamadas dos métodos de acordo com a especificação.
Como segue:
Create Person - [POST]          http://localhost:3000/person
Get Person - [GET]              http://localhost:3000/person/:CPF
Clean - [DELETE]                http://localhost:3000/clean
Create Relationship - [POST]    http://localhost:3000/relationship
Get Recommendations - [GET]     http://localhost:3000/recommendations/:CPF

## Build
Execute o arquivo para gerar o container:

```
./runDocker.sh
```
*Obs.: O Docker precisa estar instalado. Instruções de como instalar o Docker em Windows, Mac e Linux, veja [este post](https://blog.umbler.com/br/containers-102-primeiros-passos-para-realizar-a-instalacao?a=7e8480pk).*

## Executando os testes
Para executar os testes unitários, use o comando:
```
npm run test:unit
```
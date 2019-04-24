# Hydro Augur Scaffold

This repository will guide you through setting up your own Hydro Augur Relayer on the Ethereum blockchain. With a simple docker-compose command, you can have a fully functional Hydro Augur Relayer running on your local server.

## Quick Start Guide

0.  As a prerequisite, you must have `docker` and `docker-compose` installed.

    If not, you can follow [this link](https://docs.docker.com/compose/install/) to install them.
    If you are new to docker and git, make sure you setup your git access key and ssh key.

1.  Clone this repo

        git clone https://github.com/hydroprotocol/hydro-augur-scaffold

1.  Change working dir

        cd hydro-augur-scaffold

1.  Start

        docker-compose up --build -d

    This step may takes a few minutes to prepare all envs.
    When complete, this will start all necessary services in docker.

    It will use ports `3000`, `3001`, `3002`, `6379`, `8545` on your computer. Please make sure theses ports are available.

1.  View Relayer

    Open `http://localhost:3000/` on your browser. Proceed to the next step to use your Relayer.
    
1.  Setup wallet and address

    1.  Install the metamask wallet browser extension
        
        Note - currently, we only support metamask as your wallet. If you have metamask installed, please move to the next section.

        - For Chrome [Download](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn).
        - For Firefox [Download](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)
        - For Brave, metamask is built-in. You can enable it at `about:preferences#extensions`.

    1.  Switch network

        Metamask's default network is mainnet. For our augur scaffold, we will use **localhost** to test for now.

        Open the metamask extension and switch the network to `localhost:8545`

    1.  Import an account

        We have already prepared a pre-filled address for you! The private key is `0xb7a0c9d2786fc4dd080ea5d619d36771aeb0c8c26c290afd3451b92ba2b7bc2c`, address is `0x31ebd457b999bf99759602f5ece5aa5033cb56b3`.

        Import the private key into your metamask then switch to this account.

1.  Make some trades
    
    Now that your wallet is setup, you can make some trades on your local server to test it out. Try making a buy and sell order.

1.  Get status

        docker-compose ps

    This will show each service running status.

1.  View logs

        # view logs of the service that defined in docker-compose.yml services
        # e.g. view watcher log
        docker-compose logs --tail=20 -f watcher
        # e.g. view api log
        docker-compose logs --tail=20 -f api

    This will show logs of the service which you point.

1.  Stop

        docker-compose stop

    This will stop all services.

## How do I update to the latest?

0.  Update This repo

        git pull origin master

1.  Clean old state (data wil be deleted)

        docker-compose down -v

1.  Run

        docker-compose pull && docker-compose up -d

    Always pull latest images before docker-compose up (If image doesn't have new version, will not pull).

## What comes with this scaffolding?

- Frontend:
  - A Basic Exchange Web UI
- Backend:
  - Http Server to serve API data
  - Websocket Server to handle keepalive connections and serve realtime data
  - Matching Engine to send matching orders to the hydro smart contract
  - Blockchain Monitor to watch for transaction changes on the blockchain
- [Sqlite3](https://www.sqlite.org/index.html) as database
- [ganache-cli](https://github.com/trufflesuite/ganache-cli) to run a local ethereum node

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details

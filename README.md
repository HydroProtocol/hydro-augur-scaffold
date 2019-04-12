# Hydro Demo Augur

This repository will guide you through setting up your own Hydro Augur Relayer on the Ethereum blockchain. With a simple docker-compose command, you can have a fully functional Hydro Augur Relayer running on your local server.

## How do I start a local relayer?

0.  As a prerequisite, you must have `docker` and `docker-compose` installed.

    If not, you can follow [this link](https://docs.docker.com/compose/install/) to install them.
    If you are new to docker and git, make sure you setup your git access key and ssh key.

1.  Clone this repo

        git clone https://github.com/hydroprotocol/hydro-sdk-demo-augur

1.  Change working dir

        cd hydro-sdk-demo-augur

1.  Start

        docker-compose up --build -d 

    This step may takes a few minutes to prepare all envs.
    When complete, this will start all necessary services in docker.

    It will use ports `3000`, `3001`, `3002`, `6379`, `8545` on your computer. Please make sure theses ports are available.

1.  View Relayer

    Open `http://localhost:3000/` on your browser. Proceed to the next step to use your Relayer.

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

## What comes with this demo?

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

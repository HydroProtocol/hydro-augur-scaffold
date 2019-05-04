![image](assets/hydro_black_wider.png)

***

[Hydro Protocol](https://hydroprotocol.io) is an open source framework for building decentralized exchanges and other DeFi projects.

More detailed information can be found in our [developer documentation](https://developer.hydroprotocol.io/docs/overview/getting-started.html).

Building on Hydro? Come chat with our team on our [Hydro Relayer Slack Channel](https://join.slack.com/t/hydrorelayer/shared_invite/enQtNTc1Mjc3MDUyNTkzLWNmZjI0YmFhNTg4OTU4NTI5ZWE1MzY1ZTc1MDMyYmE1YzkwYWUwYzQ2MTNhMTRjNmVjMmEyOTRkMjFlNzAyMTQ).

***

# Hydro Augur Scaffold

This repository will guide you through setting up your own Hydro-Augur Relayer on the Ethereum blockchain. When you finish the steps outlined in this guide, you will have:

- Setup a fully functioning prediction market on your local server
- Leveraged Hydro Protocol and Augur smart contracts on Ethereum to securely manage a prediction market (PM)
- Traded some predictions on your Hydro PM
- Learned how to customize your PM

It should take less than 10 minutes to get your Prediction Market running.

## Quick Start Guide

### Prerequisites

The only required software that you must have installed are `docker` and `docker-compose`.

If you don't already have them installed, you can follow [this link](https://docs.docker.com/compose/install/) to install them (free).

### Initial Setup

1.  **Clone this repo**

        git clone https://github.com/hydroprotocol/hydro-augur-scaffold

1.  **Change working dir**

        cd hydro-augur-scaffold

1.  **Build and launch your hydro prediction market**

        docker-compose up --build -d

    This step may takes a few minutes.
    When complete, it will start all necessary services.

    It will use ports `3000`, `3001`, `3002`, `6379`, `8545` on your computer. Please make sure that these ports are available.

1.  **Check out your Prediction Market**

    Open http://localhost:3000/ on your browser to see your prediction market in action!
    
## Testdrive your Prediction Market

Now that your PM is up on your local server, let's try it out a bit.

1.  **Connect a wallet**

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

1.  **Make some trades**
    
    Now that your wallet is setup, you can make some trades on your local server to test it out. Try making a buy and sell order.

***

# Additional Info

## Useful Docker Commands

1.  **Display the status of all services running**

        docker-compose ps

    This command displays the status of all services running in docker. It's helpful for troubleshooting and for understanding the combination of components that goes into running your DEX.

2. **Stopping your Relayer**

        docker-compose stop

   This command will stop all of the current services running in docker.

3. **Restarting your Relayer**

        docker-compose pull && docker-compose up -d

   The same command that you ran to start it the first time can be used for subsequent restarts. Always run the pull command first, as the docker-compose up command will not run without an image.

1.  **View logs**

        # view logs of the service that defined in docker-compose.yml services
        # e.g. view watcher log
        docker-compose logs --tail=20 -f watcher
        # e.g. view api log
        docker-compose logs --tail=20 -f api

    Much like the status, viewing the logs can give you an idea of the specific details involved in each service.

5.  **Update this repo**

        git pull origin master

6.  **Completely clean the old state (data will be deleted)**

        docker-compose down -v

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

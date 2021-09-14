import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import getConfig from './config.js';
import * as nearAPI from 'near-api-js';

// Initializing contract
async function initContract() {
  const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near);

  // Load in account data
  let currentUser;
  if(walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount
    };
  }

  // Initializing our contract APIs by contract name and configuration
  const contract = await new nearAPI.Contract(walletConnection.account(), nearConfig.counterContractName, {
    // View methods are read-only – they don't modify the state, but usually return some value
    viewMethods: ["get_num"],
    // Change methods can modify the state, but you don't receive the returned value when called
    changeMethods: ["increment", "decrement", "reset"],
    // Sender is the account ID to initialize transactions.
    // getAccountId() will return empty string if user is still unauthorized
    sender: walletConnection.getAccountId()
  });

  const initialTeamA = await contract.account.viewFunction(nearConfig.teamManagerContractName, "get_team_a", {});
  const initialTeamB = await contract.account.viewFunction(nearConfig.teamManagerContractName, "get_team_b", {});
  const initialCounter = await contract.get_num({});

  return { contract, currentUser, nearConfig, walletConnection, initialTeamA, initialTeamB, initialCounter };
}

window.nearInitPromise = initContract()
  .then(({ contract, currentUser, nearConfig, walletConnection, initialTeamA, initialTeamB, initialCounter }) => {
    ReactDOM.render(
      <App
        counterContract={contract}
        currentUser={currentUser}
        nearConfig={nearConfig}
        wallet={walletConnection}
        initialTeamA={initialTeamA}
        initialTeamB={initialTeamB}
        initialCounter={initialCounter}
      />,
      document.getElementById('root')
    );
  });
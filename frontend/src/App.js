import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'prop-types';
import Counter from './components/Counter';

const App = ({ counterContract, currentUser, nearConfig, wallet, initialCounter, initialTeamA, initialTeamB }) => {

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.counterContractName,
      'NEAR Cross-Contract Rust Counter'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };
  return (
    <>
      <h1>NEAR Cross-Contract Calls Counter Example</h1>
      { currentUser
          ? <div>
              <h2>
                Account ID: {currentUser.accountId}
                {" "}
                <button onClick={signOut}>Log out</button>
              </h2>
            
              <Counter 
                counterContract={counterContract}
                teamManagerContractName={nearConfig.teamManagerContractName}
                nearConfig={nearConfig}
                initialTeamA={initialTeamA}
                initialTeamB={initialTeamB}
                initialCounter={initialCounter}
              />
            </div>
          : 
          <div>
            Sign In To Use The App: 
            {" "}
            <button onClick={signIn}>Log in</button>
          </div>
        }
    </>
  );
};

App.propTypes = {
  counterContract: PropTypes.shape({
    get_num: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    counterContractName: PropTypes.string.isRequired,
    teamManagerContractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
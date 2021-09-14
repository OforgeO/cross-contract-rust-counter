const COUNTER_CONTRACT_NAME = process.env.COUNTER_CONTRACT_NAME || 'dev-1631640334277-70325126364752';
const TEAM_MANAGER_CONTRACT_NAME = process.env.TEAM_MANAGER_CONTRACT_NAME || 'fayyr100.testnet';

function getConfig(env) {
  switch(env) {
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        counterContractName: COUNTER_CONTRACT_NAME,
        teamManagerContractName: TEAM_MANAGER_CONTRACT_NAME,
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      };
    // This is an example app so production is set to testnet.
    // You can move production to mainnet if that is applicable.
    case 'production':
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        counterContractName: COUNTER_CONTRACT_NAME,
        teamManagerContractName: TEAM_MANAGER_CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      };
    case 'betanet':
      return {
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        counterContractName: COUNTER_CONTRACT_NAME,
        teamManagerContractName: TEAM_MANAGER_CONTRACT_NAME,
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org'
      };
    case 'local':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
        counterContractName: COUNTER_CONTRACT_NAME,
        teamManagerContractName: TEAM_MANAGER_CONTRACT_NAME,
      };
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        counterContractName: COUNTER_CONTRACT_NAME,
        teamManagerContractName: TEAM_MANAGER_CONTRACT_NAME,
        masterAccount: 'test.near'
      };
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        counterContractName: COUNTER_CONTRACT_NAME,
        teamManagerContractName: TEAM_MANAGER_CONTRACT_NAME,
        masterAccount: 'test.near'
      };
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
  }
}

module.exports = getConfig;
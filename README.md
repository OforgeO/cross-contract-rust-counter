Counter with simple Cross-Contract calls in Rust
=================================

- Deploy the modified counter found in the contract folder and specify `TEAM_MANAGER_CONTRACT_ID`.
- Deploy second contract found in the team-manager folder.
- The team manager contract consists of two teams - team A and team B. When you incremement the counter, the team with the least amount of players will get assigned a member. 
- When you decremement the counter, the team with the most amount of players will have a member removed. 
- If there is a tie, team A will be prioritized. 
- When you reset the counter, both teams will be reset to zero.

Original RUST-COUNTER readme:

<!-- MAGIC COMMENT: DO NOT DELETE! Everything above this line is hidden on NEAR Examples page -->

## Description

These contracts form a basic example for performing cross-contract calls using the classic rust counter example. 

## Setup
Install dependencies:

```
yarn
```

If you don't have `Rust` installed, complete the following 3 steps:

1) Install Rustup by running:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

([Taken from official installation guide](https://www.rust-lang.org/tools/install))

2) Configure your current shell by running:

```
source $HOME/.cargo/env
```

3) Add wasm target to your toolchain by running:

```
rustup target add wasm32-unknown-unknown
```

Next, make sure you have `near-cli` by running:

```
near --version
```

If you need to install `near-cli`:

```
npm install near-cli -g
```

## To Run
Clone the repository.

```
git clone https://github.com/near-examples/cross-contract-rust-counter.git
```

## To Build
When in the root folder, you can build both contracts which will create the wasms to `out/counter.wasm` and `out/team-manager.wasm`

```
yarn build
```

## To Test
When in the root folder, you can run unit tests for both contracts using the following command.

```
yarn test:cargo
```

## To Deploy
After building, you can deploy the contracts to a dev account using the following commands:


```
near dev-deploy --wasmFile out/counter.wasm
```
And

```
near dev-deploy --wasmFile out/team-manager.wasm
```

To deploy to an existing account, login with `near-cli` by following the instructions after this command:

```
near login
```

You can then deploy to the logged in account via the following: 
```
near deploy --accountId YOUR_ACCOUNT_ID --wasmFile out/counter.wasm
```
And

```
near deploy --accountId YOUR_ACCOUNT_ID --wasmFile out/team-manager.wasm
```

## To Build the Documentation

```
cd contract
cargo doc --no-deps --open
```

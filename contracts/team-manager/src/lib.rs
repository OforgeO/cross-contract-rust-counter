//! This contract implements a simple team manager counter backed by storage on blockchain.
//!
//! The contract provides methods to [assign_to_team] / [remove_from_team] counter and
//! [get their current sizes][get_team_a] / [get_team_b] or [reset_teams].

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};

near_sdk::setup_alloc!();


// add the following attributes to prepare your code for serialization and invocation on the blockchain
// More built-in Rust attributes here: https://doc.rust-lang.org/reference/attributes.html#built-in-attributes-index
#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct TeamManager {
    // See more data types at https://doc.rust-lang.org/book/ch03-02-data-types.html
    team_a: i8, // i8 is signed. unsigned integers are also available: u8, u16, u32, u64, u128
    team_b: i8, // i8 is signed. unsigned integers are also available: u8, u16, u32, u64, u128
}


#[near_bindgen]
impl TeamManager {
    /// Returns 8-bit signed integer of team a's value.
    ///
    /// This must match the type from our struct's 'team_a' defined above.
    ///
    /// Note, the parameter is `&self` (without being mutable) meaning it doesn't modify state.
    /// In the frontend (/src/main.js) this is added to the "viewMethods" array
    /// using near-cli we can call this by:
    ///
    /// ```bash
    /// near view THIS_CONTRACT.testnet get_team_a
    /// ```
    pub fn get_team_a(&self) -> i8 {
        return self.team_a;
    }

    /// Returns 8-bit signed integer of team b's value.
    ///
    /// This must match the type from our struct's 'team_b' defined above.
    ///
    /// Note, the parameter is `&self` (without being mutable) meaning it doesn't modify state.
    /// In the frontend (/src/main.js) this is added to the "viewMethods" array
    /// using near-cli we can call this by:
    ///
    /// ```bash
    /// near view THIS_CONTRACT.testnet get_team_b
    /// ```
    pub fn get_team_b(&self) -> i8 {
        return self.team_b;
    }

    /// Add a player to the team with the least members. If there is a tie, prioritize team A.
    ///
    /// Note, the parameter is "&mut self" as this function modifies state.
    /// In the frontend (/src/main.js) this is added to the "changeMethods" array
    /// using near-cli we can call this by:
    ///
    /// ```bash
    /// near call THIS_CONTRACT.testnet assign_to_team --accountId YOU.testnet
    /// ```
    pub fn assign_to_team(&mut self) {
        if self.team_a <= self.team_b {
            self.team_a += 1;
            let log_message = format!("Team A has the least players. Adding a player. Total count is now {} players", self.team_a);
            env::log(log_message.as_bytes());
        } else {
            self.team_b += 1;
            let log_message = format!("Team B has the least players. Adding a player. Total count is now {} players", self.team_b);
            env::log(log_message.as_bytes());
        }
        // note: adding one like this is an easy way to accidentally overflow
        // real smart contracts will want to have safety checks
        // e.g. self.val = i8::wrapping_add(self.val, 1);
        // https://doc.rust-lang.org/std/primitive.i8.html#method.wrapping_add
    }

    /// Remove a player (subtract) from the team with the most members. If there is a tie, prioritize team A.
    ///
    /// In (/src/main.js) this is also added to the "changeMethods" array
    /// using near-cli we can call this by:
    ///
    /// ```bash
    /// near call THIS_CONTRACT.testnet remove_from_team --accountId YOU.testnet
    /// ```
    pub fn remove_from_team(&mut self) {
        if self.team_a >= self.team_b {
            self.team_a -= 1;
            let log_message = format!("Team A has the most players. Removing a player. Total count is now {} players", self.team_a);
            env::log(log_message.as_bytes());
        } else {
            self.team_b -= 1;
            let log_message = format!("Team B has the most players. Removing a player. Total count is now {} players", self.team_b);
            env::log(log_message.as_bytes());
        }
        // note: subtracting one like this is an easy way to accidentally overflow
        // real smart contracts will want to have safety checks
        // e.g. self.val = i8::wrapping_sub(self.val, 1);
        // https://doc.rust-lang.org/std/primitive.i8.html#method.wrapping_sub
    }

    /// Reset both teams to zero.
    pub fn reset_teams(&mut self) {
        self.team_a = 0;
        self.team_b = 0;
        // Another way to log is to cast a string into bytes, hence "b" below:
        env::log(b"Reset both teams to zero");
    }
}

/*
 * the rest of this file sets up unit tests
 * to run these, the command will be:
 * cargo test --package rust-counter-tutorial -- --nocapture
 * Note: 'rust-counter-tutorial' comes from cargo.toml's 'name' key
 */

// use the attribute below for unit tests
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::testing_env;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::json_types::ValidAccountId;
    use near_sdk::serde::export::TryFrom;

    // simple helper function to take a string literal and return a ValidAccountId
    fn to_valid_account(account: &str) -> ValidAccountId {
        ValidAccountId::try_from(account.to_string()).expect("Invalid account")
    }

    // part of writing unit tests is setting up a mock context
    // provide a `predecessor` here, it'll modify the default context
    fn get_context(predecessor: ValidAccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }

    // mark individual unit tests with #[test] for them to be registered and fired
    #[test]
    fn assign_to_team() {
        // set up the mock context into the testing environment
        let context = get_context(to_valid_account("foo.near"));
        testing_env!(context.build());
        // instantiate a contract variable with the counter at zero
        let mut contract = TeamManager { team_a: 0, team_b: 0 };
        contract.assign_to_team();
        println!("Value after assigning to team: {}", contract.get_team_a());
        // confirm that we received 1 when calling get_team_a
        assert_eq!(1, contract.get_team_a());
    }

    #[test]
    fn remove_from_team() {
        let context = VMContextBuilder::new();
        testing_env!(context.build());
        let mut contract = TeamManager { val: 0 };
        contract.remove_from_team();
        println!("Value after removing from team: {}", contract.get_team_a());
        // confirm that we received -1 when calling get_team_a
        assert_eq!(-1, contract.get_team_a());
    }

    #[test]
    fn assign_and_reset() {
        let context = VMContextBuilder::new();
        testing_env!(context.build());
        let mut contract = TeamManager { val: 0 };
        contract.assign_to_team();
        contract.reset_teams();
        println!("Value after reset: {}", contract.get_team_a());
        // confirm that we received -1 when calling get_team_a
        assert_eq!(0, contract.get_team_a());
    }
}

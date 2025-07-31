#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, Address, BytesN, Env, String, Symbol};

#[contract]
pub struct SilverToken;

#[contractimpl]
impl SilverToken {
    pub fn init(env: Env, admin: Address) {
        let storage = env.storage().instance();
        storage.set(&symbol_short!("admin"), &admin);
    }

    pub fn name(env: Env) -> String {
        String::from_str(&env, "Silver")
    }

    pub fn symbol(env: Env) -> String {
        String::from_str(&env, "SILVER")
    }

    pub fn decimals(_env: Env) -> u32 {
        9
    }

    pub fn description(env: Env) -> String {
        String::from_str(
            &env,
            "Silver, commonly used by heroes to purchase necessary adventure equipment",
        )
    }

    pub fn icon_url(env: Env) -> String {
        String::from_str(&env, "https://testurl.com/")
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let storage = env.storage().instance();
        // let admin: Address = storage.get(&symbol_short!("admin")).unwrap();
        // admin.require_auth();

        let key = to.to_val();
        let balance: i128 = storage.get(&key).unwrap_or(0);
        storage.set(&key, &(balance + amount));
    }

    pub fn balance_of(env: Env, user: Address) -> i128 {
        let storage = env.storage().instance();
        let key = user.to_val();
        storage.get(&key).unwrap_or(0)
    }

    pub fn burn(env: Env, from: Address, amount: i128) {
        from.require_auth();

        let storage = env.storage().instance();
        let key = from.to_val();
        let balance: i128 = storage.get(&key).unwrap_or(0);

        if balance < amount {
            panic!("Not enough balance to burn");
        }

        storage.set(&key, &(balance - amount));
    }
}

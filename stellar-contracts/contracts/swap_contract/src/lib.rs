//! Stellar Soroban Atomic Swap Contract

#![no_std]
extern crate alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

use alloc::string::ToString;
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Bytes, BytesN, Env, Symbol,
};

#[contract]
pub struct SwapContract;

#[derive(Clone)]
#[contracttype]
pub struct Order {
    maker: Address,
    amount: i128,
    min_amount: i128,
    expiration: u64,
    secret_hash: BytesN<32>,
    claimed: bool,
    revealed_secret: Option<Bytes>,
}

#[contractimpl]
impl SwapContract {
    pub fn announce_order(
        env: Env,
        caller: Address,
        order_id: Symbol,
        amount: i128,
        min_amount: i128,
        expiration: u64,
        secret_hash: BytesN<32>,
    ) {
        if amount <= 0 || min_amount <= 0 {
            panic!("invalid amount");
        }

        if env.storage().instance().has(&order_id) {
            panic!("order ID already exists");
        }

        let order = Order {
            maker: caller.clone(),
            amount,
            min_amount,
            expiration,
            secret_hash: secret_hash.clone(),
            claimed: false,
            revealed_secret: None,
        };

        env.storage().instance().set(&order_id, &order);

        env.events()
            .publish((symbol_short!("Announced"),), order_id);
    }

    pub fn claim_funds(env: Env, order_id: Symbol, secret: Bytes) {
        let now = env.ledger().timestamp();
        let mut order: Order = env
            .storage()
            .instance()
            .get(&order_id)
            .expect("order not found");

        if now >= order.expiration {
            panic!("order expired");
        }
        if order.claimed {
            panic!("already claimed");
        }

        let computed_hash = env.crypto().keccak256(&secret);
        if computed_hash != order.secret_hash {
            panic!("invalid secret");
        }

        order.claimed = true;
        order.revealed_secret = Some(secret.clone());

        env.storage().instance().set(&order_id, &order);

        env.events().publish((symbol_short!("Claimed"),), order_id);
    }

    pub fn cancel_order(env: Env, caller: Address, order_id: Symbol) {
        let now = env.ledger().timestamp();

        let mut order: Order = env
            .storage()
            .instance()
            .get(&order_id)
            .expect("order not found");

        if order.claimed {
            panic!("already claimed/cancelled");
        }

        if caller != order.maker && now < order.expiration {
            panic!("not authorized or too early to cancel");
        }

        order.claimed = true;
        order.revealed_secret = Some(Bytes::from_array(&env, &[0u8]));

        env.storage().instance().set(&order_id, &order);

        env.events()
            .publish((symbol_short!("Cancelled"),), order_id);
    }

    pub fn get_order(env: Env, order_id: Symbol) -> Option<Order> {
        env.storage().instance().get(&order_id)
    }

    pub fn get_revealed_secret(env: Env, order_id: Symbol) -> Option<Bytes> {
        let order: Order = env.storage().instance().get(&order_id)?;
        order.revealed_secret
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Bytes, BytesN, Env};

    #[test]
    fn test_announce_and_claim() {
        let env = Env::default();
        let user = Address::random(&env);
        let order_id = symbol_short!("ORD1");
        let amount = 100;
        let min_amount = 90;
        let expiration = env.ledger().timestamp() + 500;
        let secret = Bytes::from_array(&env, b"supersecret");
        let secret_hash = env.crypto().keccak256(&secret);

        SwapContract::announce_order(
            env.clone(),
            user.clone(),
            order_id.clone(),
            amount,
            min_amount,
            expiration,
            secret_hash.clone(),
        );

        assert!(SwapContract::get_order(env.clone(), order_id.clone()).is_some());

        SwapContract::claim_funds(env.clone(), order_id.clone(), secret.clone());

        let revealed = SwapContract::get_revealed_secret(env.clone(), order_id.clone()).unwrap();
        assert_eq!(revealed, secret);
    }
}

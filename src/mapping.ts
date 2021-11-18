import { BigInt } from "@graphprotocol/graph-ts"
import { staking, Staked, Unstaked  } from "../generated/staking/staking"
import { BalanceOfStake, StakedEntity, UnstakedEntity } from "../generated/schema"

export function handleStaked(event: Staked): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = StakedEntity.load(event.transaction.hash.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new StakedEntity(event.transaction.hash.toHex())
  }

  // BigInt and BigDecimal math are supported
  // Entity fields can be set based on event parameters
  entity.from = event.params.from
  entity.amount = event.params.amount

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOfStake(...)
  // - contract.checkWithdrawInfo(...)
  // - contract.tokenAddress(...)
  // - contract.totalStaked(...)
}

export function handleUnstaked(event: Unstaked): void {
  let entity = UnstakedEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new UnstakedEntity(event.transaction.from.toHex())
  }

  // BigInt and BigDecimal math are supported
  // Entity fields can be set based on event parameters
  entity.from = event.params.from
  entity.amount = event.params.amount

  // Entities can be written to the store with `.save()`
  entity.save()
}

export function handleBalanceOfStake(eventOfStake: Staked, eventOfUnstaked: Unstaked): void {
  // let entityBalanceOfStake = BalanceOfStake.load(eventOfStake.transaction.from.toHex())

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (!entityBalanceOfStake) {
  //   entityBalanceOfStake = new BalanceOfStake(eventOfStake.transaction.from.toHex())
  // }

  // // BigInt and BigDecimal math are supported
  // // Entity fields can be set based on event parameters
  // // entityStaked.from = eventOfStake.params.from
  // // entityStaked.amount = eventOfStake.params.amount

  // // entityUnstaked.from = eventOfUnstaked.params.from
  // // entityUnstaked.amount = eventOfUnstaked.params.amount
  // entityBalanceOfStake.address = eventOfStake.params.from
  // entityBalanceOfStake.amount = eventOfStake.params.amount.minus(eventOfUnstaked.params.amount)

  // // Entities can be written to the store with `.save()`
  // entityBalanceOfStake.save()
    // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  let stakingContract = staking.bind(eventOfStake.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //  
  stakingContract.balanceOfStake(eventOfStake.params.from)
  // - contract.checkWithdrawInfo(...)
  // - contract.tokenAddress(...)
  // - contract.totalStaked(...)
}

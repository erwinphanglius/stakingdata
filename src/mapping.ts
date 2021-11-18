import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { staking, Staked, Unstaked  } from "../generated/staking/staking"
import { User ,StakedEntity, UnstakedEntity } from "../generated/schema"

export function addTotalDepositedByUser(address: Address, newValue: BigInt): void {
  let id = address.toHexString();
  let user = User.load(id);
  if (user == null) {
    user = new User(id);
    user.address = address;
    user.totalValue = BigInt.fromI32(0);
  }
  user.totalValue = user.totalValue.plus(newValue);
  user.save();
}

export function substractTotalDepositedByUser(address: Address, newValue: BigInt): void {
  let id = address.toHexString();
  let user = User.load(id);
  if (user == null) {
    user = new User(id);
    user.address = address;
    user.totalValue = BigInt.fromI32(0);
  }
  user.totalValue = user.totalValue.minus(newValue);
  user.save();
}

export function handleStaked(event: Staked): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = StakedEntity.load(event.transaction.hash.toHex())
  
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new StakedEntity(event.transaction.hash.toHex())
  }
  addTotalDepositedByUser(event.params.from, event.params.amount);
  
  // BigInt and BigDecimal math are supported
  // Entity fields can be set based on event parameters
  entity.from = event.params.from
  entity.amount = event.params.amount
  entity.save()

  
  // Entities can be written to the store with `.save()`

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = staking.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // let a = contract.balanceOfStake(event.params.from)
  // entity.balanceOfStake = a
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
  substractTotalDepositedByUser(event.params.from, event.params.amount);

  // BigInt and BigDecimal math are supported
  // Entity fields can be set based on event parameters
  entity.from = event.params.from
  entity.amount = event.params.amount

  entity.save()
}
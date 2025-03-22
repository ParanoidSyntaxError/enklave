import { EKPostCreated as EKPostCreatedEvent } from "../generated/EKPostFactory/EKPostFactory"
import { EKPostCreated } from "../generated/schema"

export function handleEKPostCreated(event: EKPostCreatedEvent): void {
  let entity = new EKPostCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.post = event.params.post

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

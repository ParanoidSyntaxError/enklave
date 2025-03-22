import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { EKPostCreated } from "../generated/EKPostFactory/EKPostFactory"

export function createEKPostCreatedEvent(post: Address): EKPostCreated {
  let ekPostCreatedEvent = changetype<EKPostCreated>(newMockEvent())

  ekPostCreatedEvent.parameters = new Array()

  ekPostCreatedEvent.parameters.push(
    new ethereum.EventParam("post", ethereum.Value.fromAddress(post))
  )

  return ekPostCreatedEvent
}

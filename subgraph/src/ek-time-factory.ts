import { EKTimeCreated } from "../generated/EKTimeFactory/EKTimeFactory"
import { TimeContract } from "../generated/schema"
import { EKTimeTemplate } from "../generated/templates";

export function handleEKTimeCreated(event: EKTimeCreated): void {
	EKTimeTemplate.create(event.params.time);

	let timeContract = new TimeContract(event.transaction.hash);
	timeContract.address = event.params.time;
	timeContract.save();
}

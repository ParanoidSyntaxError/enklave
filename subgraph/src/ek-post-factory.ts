import { EKPostCreated } from "../generated/EKPostFactory/EKPostFactory"
import { PostContract } from "../generated/schema"

export function handleEKPostCreated(event: EKPostCreated): void {
	let postContract = new PostContract(event.params.post);
	postContract.address = event.params.post;
	postContract.save();
}

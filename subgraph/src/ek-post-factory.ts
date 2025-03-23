import { EKPostCreated } from "../generated/EKPostFactory/EKPostFactory"
import { PostContract } from "../generated/schema"
import { EKPostTemplate } from "../generated/templates";
import { EKPost } from "../generated/templates/EKPostTemplate/EKPost";

export function handleEKPostCreated(event: EKPostCreated): void {
	EKPostTemplate.create(event.params.post);

	let postContract = new PostContract(event.params.post);
	postContract.address = event.params.post;

	let ekPost = EKPost.bind(event.params.post);

	postContract.owner = ekPost.owner();
	postContract.name = ekPost.name();
	postContract.symbol = ekPost.symbol();

	postContract.save();
}

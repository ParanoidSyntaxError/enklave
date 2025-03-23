import { EKPost, Transfer } from "../generated/templates/EKPostTemplate/EKPost"
import { Post } from "../generated/schema"
import { Address, Bytes } from "@graphprotocol/graph-ts";

export function handleTransfer(event: Transfer): void {
    if(event.params.from == Address.zero()) {
        let post = new Post(Bytes.fromByteArray(Bytes.fromBigInt(event.params.tokenId)));
        post.tokenId = event.params.tokenId;
    
        let ekPost = EKPost.bind(event.address);

        post.uri = ekPost.tokenURI(event.params.tokenId);

        post.save();
    }
}

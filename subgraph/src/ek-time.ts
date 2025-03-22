import { EKTime, Transfer } from "../generated/templates/EKTimeTemplate/EKTime"
import { TimeAccount } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
    let toAccount = TimeAccount.load(event.params.to);
    if (toAccount == null) {
        toAccount = new TimeAccount(event.params.to);
        toAccount.time = event.address;
        toAccount.address = event.params.to;
    }

    let fromAccount = TimeAccount.load(event.params.from);
    if (fromAccount == null) {
        fromAccount = new TimeAccount(event.params.from);
        fromAccount.time = event.address;
        fromAccount.address = event.params.from;
    }

    let ekTime = EKTime.bind(event.address);

    toAccount.balance = ekTime.balanceOf(event.params.to);
    toAccount.decayTimestamp = event.block.timestamp;

    fromAccount.balance = ekTime.balanceOf(event.params.from);
    fromAccount.decayTimestamp = event.block.timestamp;

    toAccount.save();
    fromAccount.save();
}

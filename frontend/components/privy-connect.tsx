"use client";

import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export function PrivyConnect({
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const { ready, connectWallet } = usePrivy();

    const { wallets } = useWallets();
    const [wallet, setWallet] = useState<ConnectedWallet | undefined>();
    useEffect(() => {
        const findWallet = async () => {
            for (let i = 0; i < wallets.length; i++) {
                if(wallets[i].connectorType === "injected") {
                    const isConnected = await wallets[i].isConnected();
                    if(isConnected) {
                        setWallet(wallets[i]);
                        return;
                    }
                }
            }
        };  

        findWallet();
    });

    if (!ready) {
        return (
            <Button
                {...props}
                disabled
            />
        );
    }

    if (!wallet) {
        return (
            <Button
                {...props}
                onClick={connectWallet}
            >
                Login
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
            >
                <Button
                    {...props}
                >
                    {wallet.address.slice(0, 8)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    (You)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut/>
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
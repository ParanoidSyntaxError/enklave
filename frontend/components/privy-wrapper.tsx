'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';

export default function PrivyWrapper({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId="cm8kofyr300bn13gcnyijyf1p"
            config={{
                defaultChain: baseSepolia,
                supportedChains: [baseSepolia],
                embeddedWallets: {
                    ethereum: { 
                        createOnLogin: "off",
                    }, 
                }, 
            }}
        >
            {children}
        </PrivyProvider>
    );
}
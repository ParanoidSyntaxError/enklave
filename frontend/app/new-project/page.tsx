"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import SidebarLayout from "@/components/sidebar-layout"
import { ConnectedWallet, useWallets } from "@privy-io/react-auth"
import * as ethers from "ethers"
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Project name must be at least 1 character.",
        })
        .max(50, {
            message: "Project name must not exceed 50 characters.",
        }),
    tokenSymbol: z
        .string()
        .min(1, {
            message: "Token symbol is required.",
        })
        .max(10, {
            message: "Token symbol must not exceed 10 characters.",
        }),
    subscriptionPrice: z.string().refine(
        (val) => {
            const num = Number.parseFloat(val)
            return !isNaN(num) && num > 0
        },
        {
            message: "Subscription price must be a positive number.",
        },
    ),
})

export default function ProjectCreationForm() {
    const router = useRouter()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            tokenSymbol: "",
            subscriptionPrice: "",
        },
    });

    const { wallets } = useWallets();
    const [wallet, setWallet] = useState<ConnectedWallet | undefined>();
    useEffect(() => {
        const findWallet = async () => {
            for (let i = 0; i < wallets.length; i++) {
                if (wallets[i].connectorType === "injected") {
                    const isConnected = await wallets[i].isConnected();
                    if (isConnected) {
                        setWallet(wallets[i]);
                        return;
                    }
                }
            }
        };

        findWallet();
    }, [wallets]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!wallet) {
            return;
        }

        setIsSubmitting(true)

        try {
            const provider = await wallet.getEthereumProvider();
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();

            const projectFactory = new ethers.Contract(
                "0x995165795f699f164760afa6520eeee896f46815",
                [{
                    "type": "function",
                    "name": "create",
                    "inputs": [
                        {
                            "name": "owner",
                            "type": "address",
                            "internalType": "address"
                        },
                        {
                            "name": "name",
                            "type": "string",
                            "internalType": "string"
                        },
                        {
                            "name": "symbol",
                            "type": "string",
                            "internalType": "string"
                        },
                        {
                            "name": "price",
                            "type": "uint256",
                            "internalType": "uint256"
                        }
                    ],
                    "outputs": [],
                    "stateMutability": "nonpayable"
                }],
                signer
            );

            const tx = await projectFactory.create(
                wallet.address,
                values.name,
                values.tokenSymbol,
                BigInt(Number(values.subscriptionPrice) * (10 ** 18))
            );

            await tx.wait();

            router.push('/discover');
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SidebarLayout>
            <div
                className="max-w-[32rem] mt-18 mb-8"
            >
                <div
                    className="text-center text-2xl mb-8"
                >
                    New Project<span className="text-xs align-top">2</span>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="My Awesome Project" {...field} />
                                    </FormControl>
                                    <FormDescription>This is the name of your project.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tokenSymbol"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Token Symbol</FormLabel>
                                    <FormControl>
                                        <Input placeholder="AWESOME" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        A unique identifier for your subscription token.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subscriptionPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monthly Subscription Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" min="0.01" placeholder="5.00" {...field} />
                                    </FormControl>
                                    <FormDescription>The monthly subscription price in USD.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Create Project
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </SidebarLayout>
    )
}
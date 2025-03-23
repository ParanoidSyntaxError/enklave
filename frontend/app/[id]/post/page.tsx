"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Loader2, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SidebarLayout from "@/components/sidebar-layout"
import * as React from 'react'
import { getProject, Project } from "@/lib/subgraph"
import { ConnectedWallet, useWallets } from "@privy-io/react-auth"
import * as ethers from "ethers"
import { useRouter } from 'next/navigation'
import { pinata } from "@/lib/pinata-config"

const linkSchema = z.object({
    url: z.string().url({ message: "Please enter a valid URL." }),
    title: z.string().min(1, { message: "Link title is required." }),
})

const formSchema = z.object({
    title: z.string()
        .min(1, {
            message: "Title must be at least 1 character.",
        }),
    description: z.string(),
    content: z.string(),
    links: z.array(linkSchema).optional().default([]),
})

export default function PostCreationForm({
    params,
}: {
    params: any
}) {
    const router = useRouter()

    const { id }: any = React.use(params);
    const [project, setProject] = useState<Project | undefined>(undefined);
    useEffect(() => {
        const tryGetProject = async () => {
            setProject(await getProject(id));
        };
        if (project === undefined) {
            tryGetProject();
        }
    }, [id]);

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

    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            content: "",
            links: [{ url: "", title: "" }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "links",
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!project || !wallet) {
            return;
        }

        setIsSubmitting(true)

        try {
            let uriPin;
            try {
                const uriJson = {
                    markdown: values.content,
                    links: values.links
                };
                const uriKeyRequest = await fetch("/api/key");
                const uriKeyData = await uriKeyRequest.json();
                uriPin = await pinata.upload.public.json(uriJson).key(uriKeyData.JWT);
            } catch (error) {
                console.error(error);
            }
            if(!uriPin) {
                return;
            }

            // TODO: Encrypt with TEE

            const encryptedIpfsHash = "";

            const provider = await wallet.getEthereumProvider();
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();

            const posts = new ethers.Contract(
                project.posts,
                [{
                    "type": "function",
                    "name": "safeMint",
                    "inputs": [
                        { "name": "to", "type": "address", "internalType": "address" },
                        { "name": "uri", "type": "string", "internalType": "string" }
                    ],
                    "outputs": [
                        { "name": "", "type": "uint256", "internalType": "uint256" }
                    ],
                    "stateMutability": "nonpayable"
                }],
                signer
            );

            const tx = await posts.safeMint(
                wallet.address,
                "data:application/json;base64," + ethers.encodeBase64(JSON.stringify({
                    "name": values.title,
                    "description": values.description,
                    "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/2.png",
                    "enklave": {
                        "version": "1.0",
                        "data": encryptedIpfsHash
                    }
                }))
            );

            await tx.wait();

            router.push(`/${project.id}`);
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
                    New Post
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="My Awesome Post" {...field} />
                                    </FormControl>
                                    <FormDescription>A catchy title for your post.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="A brief summary of your post..."
                                            className="resize-none"
                                            rows={2}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>A short description that will appear in previews.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your post content in markdown..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Write your post content.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Links</h3>
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ url: "", title: "" })}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Link
                                </Button>
                            </div>

                            {fields.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No links added yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-start gap-4 p-4 border rounded-md">
                                            <div className="flex-1 space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`links.${index}.title`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Link Title</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="GitHub Repository" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`links.${index}.url`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">URL</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="https://example.com" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="mt-6"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground">Add relevant links to your post.</p>
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Post...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Publish Post
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </SidebarLayout>
    )
}


"use client"

import SidebarLayout from "@/components/sidebar-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProject, Project } from "@/lib/subgraph";
import { shortenAddress } from "@/lib/utils";
import { ConnectedWallet, useWallets } from "@privy-io/react-auth";
import React from "react";
import { useEffect, useState } from "react";
import * as ethers from "ethers";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProjectPage({
    params,
}: {
    params: any
}) {
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
        const tryGetWallet = async () => {
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
        tryGetWallet();
    }, [wallets]);

    if (!project) {
        return (
            <SidebarLayout>
                <div
                    className="w-full max-w-[32rem] mt-18 mb-8"
                >
                    <div
                        className="text-center"
                    >
                        Project not found.
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <div
                className="w-full max-w-[32rem] mt-18 mb-8 space-y-8"
            >
                <div
                    className="w-full flex flex-col items-center space-y-4"
                >
                    <Avatar className="h-32 w-32 border-2 border-primary">
                        <AvatarImage src={"/placeholder.svg?height=100&width=100"} alt={project.name} />
                        <AvatarFallback>{project.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center space-y-1">
                        <div
                            className="flex items-center space-x-3"
                        >
                            <div
                                className="text-4xl"
                            >
                                {project.name}
                            </div>
                            <Badge
                                variant="outline"
                            >
                                {project.symbol}
                            </Badge>
                        </div>
                        <div
                            className="text-sm text-muted-foreground"
                        >
                            {shortenAddress(project.owner)}
                        </div>
                    </div>
                </div>
                {wallet?.address && ethers.getAddress(wallet.address) === ethers.getAddress(project.owner) &&
                    <div>
                        <Button
                            className="w-full"
                        >
                            <Link
                                href={`/${project.id}/post`}
                                className="flex flex-row items-center space-x-2"
                            >
                                <Plus />
                                <span>New Post</span>
                            </Link>
                        </Button>
                    </div>
                }
            </div>
        </SidebarLayout>
    )
}
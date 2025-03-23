"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn, shortenAddress } from "@/lib/utils"
import { Copy, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import { Project } from "@/lib/subgraph"

interface ProjectCardProps extends React.HTMLAttributes<HTMLElement> {
    project: Project,
    avatarUrl?: string
}

export default function ProjectCard({
    project,
    avatarUrl = "/placeholder.svg?height=100&width=100",
    ...props
}: ProjectCardProps) {
    return (
        <Link
            {...props}
            href={`/${project.id}`}
            className={cn(
                "block w-full",
                props.className
            )}
        >
            <Card
                className="w-full flex flex-row p-4 border-2 transition-all duration-200 hover:shadow-md hover:border-primary/50 cursor-pointer"
            >
                <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={avatarUrl} alt={project.name} />
                    <AvatarFallback>{project.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
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
            </Card>
        </Link>
    )
}
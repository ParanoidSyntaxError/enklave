"use server";

export interface Project {
    id: string,
    posts: string,
    time: string,
    owner: string,
    name: string,
    symbol: string
}

export interface PostContract {
    id: string,
    address: string,
    owner: string,
    name: string,
    symbol: string,
}

export async function getProject(id: string) {
    const response = await fetch(process.env.SUBGRAPH_DEV_URL, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SUBGRAPH_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
            query: `{
                postContracts(where: { id: "${id}" }) {
                    id
                    address
                    owner
                    name
                    symbol
                }
                timeContracts(where: { id: "${id}" }) {
                    id
                    address
                }
            }`
        })
    });

    if (!response.ok) {
        console.error(response.statusText);
        return undefined;
    }

    const data = (await response.json())?.data;
    if (!data) {
        return undefined;
    }

    const postContract = data?.postContracts?.[0];
    const timeContract = data?.timeContracts?.[0];
    if(!postContract || !timeContract) {
        return undefined;
    }

    return {
        id: postContract.id,
        posts: postContract.address,
        time: timeContract.address,
        owner: postContract.owner,
        name: postContract.name,
        symbol: postContract.symbol
    } as Project;
}

export async function latestProjects() {
    const response = await fetch(process.env.SUBGRAPH_DEV_URL, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SUBGRAPH_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
            query: `{
                postContracts(first: 10) {
                    id
                    address
                    owner
                    name
                    symbol
                }
                timeContracts(first: 10) {
                    id
                    address
                }
            }`
        })
    });

    if (!response.ok) {
        console.error(response.statusText);
        return undefined;
    }

    const data = (await response.json())?.data;
    if (!data) {
        return undefined;
    }

    const projects: Project[] = [];
    data?.postContracts.forEach((postContract: any) => {
        const timeContract = data?.timeContracts.find((timeContract: any) => timeContract.id === postContract.id);
        if (timeContract) {
            projects.push({
                id: postContract.id,
                posts: postContract.address,
                time: timeContract.address,
                owner: postContract.owner,
                name: postContract.name,
                symbol: postContract.symbol
            });
        }
    });

    return projects.reverse();
}

export async function ownedPostContracts(owner: string) {
    const response = await fetch(process.env.SUBGRAPH_DEV_URL, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SUBGRAPH_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
            query: `{
                postContracts(first: 10, where: { owner: ${owner} }) {
                    id
                    address
                    owner
                    name
                    symbol
                }
            }`
        })
    });

    if (!response.ok) {
        console.error(response.statusText);
        return undefined;
    }

    const data = (await response.json())?.data;
    if (!data) {
        return undefined;
    }

    return data?.postContracts as PostContract[];
}
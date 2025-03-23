declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUBGRAPH_DEV_URL: string;
            SUBGRAPH_API_KEY: string;

            PINATA_JWT: string;
            NEXT_PUBLIC_GATEWAY_URL: string;
        }
    }
}

export { }
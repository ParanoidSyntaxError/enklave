declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUBGRAPH_DEV_URL: string;
            SUBGRAPH_API_KEY: string;
        }
    }
}

export { }
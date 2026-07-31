export interface EnvInject {
    process?: {
        env: NodeJS.ProcessEnv;
    };

    readFile?(
        path: string,
        encoding: 'utf-8'
    ): string;
}
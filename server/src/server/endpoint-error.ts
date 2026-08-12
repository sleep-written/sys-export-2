import type { Response } from 'express';

export class EndpointError extends Error {
    static end(
        error: unknown,
        resp: Pick<Response, 'contentType' | 'status' | 'end'>,
    ): void {
        resp.contentType('text');
        resp.status(
            error instanceof EndpointError
            ?   error.status
            :   500
        );

        resp.end(
            error instanceof Error
            ?   error.message
            :   'Unknown error'
        );
    }

    #status: number;
    get status(): number {
        return this.#status;
    }

    constructor(status: number, message: string, options?: ErrorOptions) {
        super(message, options);
        this.#status = status;
    }
}
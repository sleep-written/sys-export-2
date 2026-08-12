import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ModalOptions } from './interfaces';
import { Modal } from './modal';
import { HttpErrorResponse } from '@angular/common/http';

@Service()
export class ModalService {
    #dialog = inject(MatDialog);

    async open<T = void>(options: ModalOptions<T>): Promise<T | undefined> {
        const dialog = this.#dialog.open<Modal<T>, ModalOptions<T>, T>(Modal, {
            data: options
        });

        return firstValueFrom(dialog.afterClosed());
    }

    async openError(err: unknown): Promise<void> {
        let title = 'Error';
        if (err instanceof HttpErrorResponse) {
            title = `Error ${err.status}`;
        }

        let message = 'Error not identified';
        if (err instanceof HttpErrorResponse && typeof err.error === 'string') {
            message = err.error;
        } else if (typeof (err as any)?.message === 'string') {
            message = (err as any)?.message;
        } else if (typeof err === 'string') {
            message = (err as any);
        }

        return this.open({
            icon: 'error',
            title,
            color: 'error',
            message,
            actions: [
                {
                    icon: 'thumb_up',
                    color: 'primary',
                    text: 'Ok',
                    value: undefined
                }
            ]
        });
    }
}

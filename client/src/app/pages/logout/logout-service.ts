import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Service()
export class LogoutService {
    #http = inject(HttpClient);

    logout(): Promise<void> {
        const o = this.#http.post<void>('api/sign-out', undefined);
        return firstValueFrom(o);
    }
}

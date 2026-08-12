import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { User } from './user';

@Service()
export class AccountService {
    #http = inject(HttpClient);

    getSelf(): Promise<User | undefined> {
        const o = this.#http.get<User | undefined>('api/me');
        return firstValueFrom(o);
    }
}

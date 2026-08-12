import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Service()
export class LoginService {
    #http = inject(HttpClient);

    gotoSignUp(): Promise<boolean> {
        const o = this.#http.get<boolean>('api/goto-sign-up');
        return firstValueFrom(o);
    }

    signIn(username: string, password: string): Promise<void> {
        const o = this.#http.post<void>('api/sign-in', { username, password });
        return firstValueFrom(o);
    }

    signUp(username: string, password: string): Promise<void> {
        const o = this.#http.post<void>('api/sign-up', { username, password });
        return firstValueFrom(o);
    }

    transformUsername(input: string): string {
        return input
            .toLowerCase()
            .replace(/[^a-z0-9\-_]/gi, '');
    }
}

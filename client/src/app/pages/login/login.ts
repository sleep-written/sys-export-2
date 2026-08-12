import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ModalModule } from '@shared/modal';
import { SignIn } from './sign-in';
import { SignUp } from './sign-up';

import { ModalService } from '@shared/modal';
import { LoginService } from './login-service';

@Component({
  selector: 'app-login',
  imports: [
    ModalModule,
    SignIn,
    SignUp,
  ],
  providers: [
    LoginService
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  #modalService = inject(ModalService);
  #service = inject(LoginService);
  #router = inject(Router);

  gotoSignUp = signal(false);

  async ngOnInit(): Promise<void> {
    await this.#service
      .gotoSignUp()
      .then(x => this.gotoSignUp.set(x))
      .catch(x => this.#modalService.openError(x));
  }

  gotoHome(): void {
    this.#router.navigate([ '/' ]);
  }
}

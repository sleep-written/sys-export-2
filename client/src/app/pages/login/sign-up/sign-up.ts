import { AbstractControl, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Component, inject, output, signal } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ModalModule } from '@shared/modal';

import { LoginService } from '../login-service';
import { ModalService } from '@shared/modal';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    ModalModule,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  #modalService = inject(ModalService);
  #service = inject(LoginService);

  signUpChange = output<void>();
  loading = signal(false);
  form = new FormBuilder().nonNullable.group({
    username:   [ '', [ Validators.required, Validators.minLength(4) ] ],
    password1:  [ '', [ Validators.required, Validators.minLength(8) ] ],
    password2:  [ '', [ Validators.required, this.pass2Validator.bind(this) ] ],
  });

  onUsernameInput(e: Event): void {
    const target = e.currentTarget as HTMLInputElement;
    const username = this.#service.transformUsername(target.value);
    this.form.controls.username.setValue(username);
  }

  pass2Validator(ctrl: AbstractControl<string>): ValidationErrors | null {
    const password1 = this.form?.controls?.password1?.value;
    const password2 = ctrl.value;
    return password1 !== password2
    ? { samePassword: false }
    : null;
  }

  async signUp(): Promise<void> {
    this.loading.set(true);
    this.form.disable();

    const { username, password1 } = this.form.getRawValue();
    await this.#service
      .signUp(username, password1)
      .then(_ => this.signUpChange.emit())
      .catch(x => this.#modalService.openError(x));

    this.loading.set(false);
    this.form.enable();
  }
}

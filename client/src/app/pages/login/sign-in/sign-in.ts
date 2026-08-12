import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    ModalModule,
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  #modalService = inject(ModalService);
  #service = inject(LoginService);

  signInChange = output<void>();
  loading = signal(false);
  form = new FormBuilder().nonNullable.group({
    username:   [ '', [ Validators.required ] ],
    password:   [ '', [ Validators.required ] ]
  });

  onUsernameInput(e: Event): void {
    const target = e.currentTarget as HTMLInputElement;
    const username = this.#service.transformUsername(target.value);
    this.form.controls.username.setValue(username);
  }

  async signIn(): Promise<void> {
    this.loading.set(true);
    this.form.disable();

    const { username, password } = this.form.getRawValue();
    await this.#service
      .signIn(username, password)
      .then(_ => this.signInChange.emit())
      .catch(x => this.#modalService.openError(x));

    this.loading.set(false);
    this.form.enable();
  }
}

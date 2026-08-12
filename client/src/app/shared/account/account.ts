import { Component, inject, OnInit, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModalModule } from '@shared/modal';

import { AccountService } from './account-service';
import { ModalService } from '@shared/modal';
import { User } from './user';

@Component({
  selector: 'app-account',
  imports: [
    MatButtonModule,
    MatIconModule,
    ModalModule,
  ],
  providers: [
    AccountService
  ],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account implements OnInit {
  #modalService = inject(ModalService);
  #service = inject(AccountService);

  user = signal<User | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    try {
      await this.#service
        .getSelf()
        .then(x => this.user.set(x));
    } catch (err) {
      await this.#modalService.openError(err);
    }
  }
}

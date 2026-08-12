import { Component, inject, OnInit } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ModalModule } from '@shared/modal';

import { LogoutService } from './logout-service';
import { ModalService } from '@shared/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [
    MatProgressSpinnerModule,
    MatCardModule,
    ModalModule,
  ],
  providers: [
    LogoutService
  ],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout implements OnInit {
  #modalService = inject(ModalService);
  #service = inject(LogoutService);
  #router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      await this.#service.logout();
      this.#router.navigate([ '/' ]);
    } catch (err) {
      this.#modalService.openError(err);
    }
  }
}

import { Component, inject, OnDestroy, output, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { MenuComponent } from './menu-component';
import { ModalModule } from '@shared/modal';

import { SidenavMenuService } from './sidenav-menu-service';
import { ModalService } from '@shared/modal';
import { Menu } from './menu-component';

@Component({
  selector: 'app-sidenav-menu',
  imports: [
    MenuComponent,
    ModalModule,
  ],
  providers: [
    SidenavMenuService
  ],
  templateUrl: './sidenav-menu.html',
  styleUrl: './sidenav-menu.scss',
})
export class SidenavMenu implements OnDestroy {
  #modalService = inject(ModalService);
  #service = inject(SidenavMenuService);
  #router = inject(Router);
  #subs = this.#router.events
    .pipe(filter(x => x instanceof NavigationEnd))
    .pipe(map(x => this.onNavigationEnd(x)))
    .subscribe();

  navigationChange = output<NavigationEnd>();
  dataSource = signal<Menu[]>([]);

  ngOnDestroy(): void {
    this.#subs.unsubscribe();
  }

  async onNavigationEnd(e: NavigationEnd): Promise<void> {
    await this.#service
      .get()
      .then(x => this.dataSource.set(x))
      .catch(x => this.#modalService.openError(x));

    this.navigationChange.emit(e);
  }
}

import { Component, inject, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { MenuComponent, Menu } from './menu-component';
import { SidenavMenuService } from './sidenav-menu-service';

@Component({
  selector: 'app-sidenav-menu',
  imports: [
    MenuComponent
  ],
  providers: [
    SidenavMenuService
  ],
  templateUrl: './sidenav-menu.html',
  styleUrl: './sidenav-menu.scss',
})
export class SidenavMenu implements OnDestroy {
  #service = inject(SidenavMenuService);
  #router = inject(Router);
  #subs = this.#router.events
    .pipe(filter(x => x instanceof NavigationEnd))
    .pipe(map(x => this.onNavigationEnd(x)))
    .subscribe();

  dataSource = signal<Menu[]>([]);

  ngOnDestroy(): void {
    this.#subs.unsubscribe();
  }

  async onNavigationEnd(_: NavigationEnd): Promise<void> {
    await this.#service
      .get()
      .then(x => this.dataSource.set(x));
  }
}

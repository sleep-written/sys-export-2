import { Component, signal } from '@angular/core';

import { RouterLinkWithHref } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { Account } from '@shared/account';

import { SidenavMenu } from '@shared/sidenav-menu';

import { MatIconDefaultOptions, MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterLinkWithHref,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    SidenavMenu,
    Account,
],
  providers: [
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: {
        fontSet: 'material-symbols-outlined'
      } as MatIconDefaultOptions
    }
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  openedSidenav = signal(false);
}

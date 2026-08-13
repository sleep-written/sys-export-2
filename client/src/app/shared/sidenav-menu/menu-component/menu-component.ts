import { Component, input, signal } from '@angular/core';
import { Menu } from './menu';

import { NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-component',
  imports: [
    NgTemplateOutlet,
    MatButtonModule,
    MatIconModule,
    RouterModule,
],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.scss',
})
export class MenuComponent {
  openedChildren = signal(true);
  opened = input(true);
  menu = input.required<Menu>();
}

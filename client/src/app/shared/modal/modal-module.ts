import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Modal } from './modal';

import { MarkdownComponent } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { provideMarkdown } from 'ngx-markdown';
import { ModalService } from './modal-service';

@NgModule({
  declarations: [
    Modal
  ],
  imports: [
    CommonModule,

    MarkdownComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  providers: [
    provideMarkdown(),
    ModalService
  ]
})
export class ModalModule {}

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';

import { ModalOptions } from './interfaces';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal<T> {
  #dialogRef = inject(MatDialogRef<Modal<T>, T>);
  data = inject<ModalOptions<T>>(MAT_DIALOG_DATA);

  close(v: T): void {
    this.#dialogRef.close(v);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent {
  @Input() title: string = 'Formulario';
  @Output() close = new EventEmitter<void>();

  constructor(public dialogRef: MatDialogRef<ModalFormComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}

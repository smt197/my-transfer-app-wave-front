import { Component,EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cancel-transaction-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './cancel-transaction-dialog.component.html',
  styleUrl: './cancel-transaction-dialog.component.css'
})
export class CancelTransactionDialogComponent {
  transactionId: string = '';
  @Output() cancelConfirmed = new EventEmitter<string>();

  onCancel() {
    this.cancelConfirmed.emit(this.transactionId);
    this.transactionId = ''; // Réinitialiser après l'envoi
  }
}

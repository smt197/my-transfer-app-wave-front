import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,FormGroup, Validators } from '@angular/forms';
import { TransService } from '../../services/trans.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isFormVisible = true;
  private socket: Socket;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransService
  ) { 
    this.transactionForm = this.fb.group({
      montant: ['', [Validators.required, Validators.min(1)]],
      sender_telephone: ['',Validators.required],
      recever_telephone: ['', Validators.required],
      transaction: ['', Validators.required],
      frais: [false]
    });
    this.socket = io('http://localhost:3000');
   }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;

      this.transactionService.executeTransaction(formData).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.errorMessage = null;
          this.transactionForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Erreur lors de la transaction';
          this.successMessage = null;
        }
      });
    }
  }
  closeForm() {
    this.isFormVisible = false;
  }

  get sender_telephone() {
    return this.transactionForm.get('sender_telephone');
  }
  get recever_telephone() {
    return this.transactionForm.get('recever_telephone');
  }
  get transaction() {
    return this.transactionForm.get('transaction');
  }
  get frais() {
    return this.transactionForm.get('frais');
  }

  get montant() {
    return this.transactionForm.get('montant');
  }

}

import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';


@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})

export class TransferComponent implements OnInit {

  transferForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder,private transactionService: TransactionService) {
    this.transferForm = this.fb.group({
      receiverId: ['', [Validators.required]],
      montant: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]]
    });
  }
  ngOnInit(): void {}
 
  onSubmit() {

    if (this.transferForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { receiverId, montant } = this.transferForm.value;

      this.transactionService.makeTransaction(receiverId, montant).subscribe({
        next: (response) => {
          console.log('Transfer successful:', response);
          this.transferForm.reset();
          // Add success notification logic here
        },
        error: (error) => {
          console.error('Transfer failed:', error);
          this.errorMessage = error.message || 'Transfer failed. Please try again.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.transferForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getter methods for form controls
  get receiverId() {
    return this.transferForm.get('receiverId');
  }

  get montant() {
    return this.transferForm.get('montant');
  }
  

}

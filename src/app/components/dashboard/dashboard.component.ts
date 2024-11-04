import { Component, OnInit,HostListener,ChangeDetectorRef } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { Notification } from '../../models/notification';
import { CommonModule } from '@angular/common';
import {  HttpClient} from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {TransferComponent} from '../transfer/transfer.component';
import { TransactionComponent } from '../transaction/transaction.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { TransService } from '../../services/trans.service';
import { CancelTransactionDialogComponent } from '../cancel-transaction-dialog/cancel-transaction-dialog.component';




@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,TransferComponent,TransactionComponent,CancelTransactionDialogComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    // Animation pour le fade in down
    trigger('fadeInDown', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-20px)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ])
    ]),

    // Animation pour le slide in
    trigger('slideIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateX(0)'
        }))
      ])
    ]),

    // Animation pour le fade in up
    trigger('fadeInUp', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(20px)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ])
    ]),

    // Animation pour le fade in/out
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),

    // Animation pour les items de la liste
    trigger('listItem', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(10px)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  userName: string | null = '';
  solde: number | null = null;
  soldeMaximum: number | null = null;
  cummulTransactionMensuelle: number | null = null;
  transactions: Transaction[] = [];
  notifications: Notification[] = [];
  currentUserId!:string ;
  showProfileMenu = false;
  showTransferForm = false;
  showTransactionForm = false;
  transferForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage: string | null = null;
  transactionIdToCancel: string | null = null;
  showDialog: boolean = false;
  showBalance: boolean = true;

  constructor(
    private transactionService: TransactionService,
    private http: HttpClient,private router:Router,
    private authService: AuthService,
    private transService: TransService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.transferForm = this.fb.group({
      receiverId: ['', Validators.required],
      montant: [
        '',
        [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]
      ]
    });
  }

  toggleTransferForm() {
    this.showTransferForm = !this.showTransferForm;
  }
  toggleTransactionForm() {
    this.showTransactionForm =!this.showTransactionForm;
  }
  onTransferSubmitted() {
    this.showTransferForm = false;
  }
  onTransactionSubmitted() {
    this.showTransactionForm = false;
  }

  ngOnInit() {
    this.loadTransactions();
  }

  onSubmit() {

    if (this.transferForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { receiverId, montant } = this.transferForm.value;

      this.transactionService.makeTransaction(receiverId, montant).subscribe({
        next: async(response) => {
          console.log('Transfer successful:', response);
          this.transferForm.reset();
          // Add success notification logic here
        },
        error: async(error) => {
          console.error('Transfer failed:', error.error.message);
          this.errorMessage = error.error.message || 'Transfer failed. Please try again.';
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


  loadTransactions() {
    // this.transactionService.getAllTransactions().subscribe({
    //   next: (transactions) => {
    //     this.transactions = transactions;
    //   },
    //   error: (error) => {
    //     console.error('Error loading transactions:', error);
    //   }
    // });

    this.transactionService .getAllNotifications().subscribe({
      next: (notifications) => {
        console.log(notifications);
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });

    this.transactionService.getUserBalance().subscribe(
      (balance) => {
        this.solde = balance.solde;
        this.soldeMaximum = balance.soldeMaximum;
        this.cummulTransactionMensuelle = balance.cummulTransactionMensuelle;
      },
      (error) => console.error('Erreur lors de la récupération du compte', error)
    );

    this.userName = this.authService.getUserName();

  }



  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu() {
    this.showProfileMenu = false;
  }

  logout() {
    localStorage.clear(); // ou vos removeItem spécifiques
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
    this.closeProfileMenu();
  }
  // Fermer le modal lorsqu'on clique en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-button') && !target.closest('.profile-menu')) {
      this.closeProfileMenu();
    }
  }


  cancelTransaction(transactionId: number | String) {
    const token = this.authService.getToken(); 
    console.log(`Annulation de la transaction avec ID: ${transactionId}`);

    this.transService.cancelTransaction(transactionId, token!).subscribe(
      (response) => {
        if (response.success) {
          this.successMessage = response.message;
          // Supprime la transaction de la liste pour mise à jour de l'interface
          this.notifications = this.notifications.filter(
            (notification) => notification._id !== transactionId
          );
        }
      },
      (error) => {
        this.errorMessage = error.error.message || 'Échec de l\'annulation de la transaction';
      }
    );
  }


  openCancelDialog() {
    this.showDialog = true;
  }

  onCancelConfirmed(transactionId: string) {
    if (transactionId) {
      this.cancelTransaction(transactionId);
    }
    else {
      console.error('ID de transaction non fourni pour annulation');
    }
    this.showDialog = false; 
  }

  toggleBalance() {
    console.log('Toggled balance visibility');
    this.showBalance = !this.showBalance;
    this.cdr.detectChanges();
  }




}

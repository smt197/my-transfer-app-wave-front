import { Component, OnInit,HostListener } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { Notification } from '../../models/notification';
import { CommonModule } from '@angular/common';
import {  HttpClient} from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {TransferComponent} from '../transfer/transfer.component';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,TransferComponent],
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
  solde!: number;
  plafond!: number;
  transactions: Transaction[] = [];
  notifications: Notification[] = [];
  currentUserId!:string ;
  showProfileMenu = false;
  showTransferForm = false;
  transferForm: FormGroup;
  isLoading = false;
  errorMessage = '';


  constructor(
    private transactionService: TransactionService,
    private http: HttpClient,private router:Router,
    private authService: AuthService,
    private fb: FormBuilder
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
  onTransferSubmitted() {
    this.showTransferForm = false;
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
      (balance) => this.solde = balance,
      (error) => console.error('Erreur lors de la récupération du solde', error)
    );

    this.transactionService.getUserPlafond().subscribe(
      (plafond) => this.plafond = plafond,
      (error) => console.error('Erreur lors de la récupération du plafond', error)
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






}

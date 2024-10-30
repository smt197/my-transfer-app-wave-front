import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Notification } from '../models/notification';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient, private authService:AuthService) {}

  makeTransaction(receiverId: string, montant: number): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    const body = { receiverId, montant };
    return this.http.post(`${this.apiUrl}/client/transfert`, body, { headers });
  }

  // getAllTransactions(): Observable<Transaction[]> {
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.authService.getToken()}`
  //   });
  //   return this.http.get<Transaction[]>(`${this.apiUrl}/client/transaction/all`, {headers});
  // }

  getAllNotifications(): Observable<Notification[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<{ success: boolean, data: { notifications: Notification[] } }>(`${this.apiUrl}/Notifications/user-notifications`,{headers})
      .pipe(
        map(response => response.data.notifications) // Récupérer uniquement les notifications
      );
  }
  

  getUserBalance(): Observable<number> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<any>(`${this.apiUrl}/client/transaction/all`, { headers }).pipe(
      map(response => response.transactions[0]?.sender?.solde)
    );
  }

  getUserPlafond(): Observable<number> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<any>(`${this.apiUrl}/client/transaction/all`, { headers }).pipe(
      map(response => response.transactions[0]?.sender?.soldeMaximum)
    );
  }
  

  requestCancellation(idTrans: string, motif: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/transaction/cancel`, { idTrans, motif });
  }
}
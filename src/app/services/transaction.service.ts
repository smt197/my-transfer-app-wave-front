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


  getAllNotifications(): Observable<Notification[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<{ success: boolean, data: { notifications: Notification[] } }>(`${this.apiUrl}/Notifications/user-notifications`,{headers})
      .pipe(
        map(response => response.data.notifications) // Récupérer uniquement les notifications
      );
  }
  

  getUserBalance(): Observable<{ solde: number, soldeMaximum: number, cummulTransactionMensuelle: number }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  
    return this.http.get<any>(`${this.apiUrl}/user/getcompte`, { headers }).pipe(
      map(response => {
        return {
          solde: response.data.solde,
          soldeMaximum: response.data.soldeMaximum,
          cummulTransactionMensuelle: response.data.cummulTransactionMensuelle
        };
      })
    );
  }
  

  getUserPlafond(): Observable<{senderPlafond:number,receiverPlafond:number}> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<any>(`${this.apiUrl}/client/transaction/all`, { headers }).pipe(
      map(response => {
        const senderPlafond = response.transactions[0]?.sender?.soldeMaximum || 0;
        const receiverPlafond = response.transactions[0]?.receiver?.soldeMaximum || 0;
        return { senderPlafond, receiverPlafond };
      })
    );
  }
  

  requestCancellation(idTrans: string, motif: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/transaction/cancel`, { idTrans, motif });
  }
}
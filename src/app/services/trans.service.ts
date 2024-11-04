import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransService {
  private apiUrl = 'http://localhost:3000/api/v1';


  constructor(private http: HttpClient,private authService: AuthService) {}

   // Effectuer une transaction
   executeTransaction(data: any): Observable<any> {
    console.log(data);
     const headers = new HttpHeaders({
       'Authorization': `Bearer ${this.authService.getToken()}`
      });
      return this.http.post(`${this.apiUrl}/transaction/create`, data, {headers});
    }

  // Annuler une transaction
  // cancelTransaction(transactionId: string, userId: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/cancel`, { transactionId, userId });
  // }

  cancelTransaction(transactionId: number | String, token: String): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/transaction/cancel/${transactionId}`, {}, { headers });
  }

}

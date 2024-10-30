import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private apiUrl = 'http://localhost:3000/api/v1';
  private token: string | null = null;
  // private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUser = this.currentUserSubject.asObservable();
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erreur lors de la lecture des données de currentUser:', error);
        localStorage.removeItem('currentUser'); // Supprimez la donnée corrompue
      }
    }
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user); 
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register`, user);
  }

  login(telephone: string, mdp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, { telephone, mdp })
      .pipe(
        tap(response => {
          if (response.data && response.data.token) {
            const user:any = {
              id: response.data._id,
              nom: response.data.nom,
              prenom: response.data.prenom,
              role: response.data.role,
              photoProfile: response.data.photoProfile,
              telephone: response.data.telephone,
            };
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', response.data.token);
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout():void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  getUserName(): string | null {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user ? user.prenom + ' ' + user.nom : null;
}
}

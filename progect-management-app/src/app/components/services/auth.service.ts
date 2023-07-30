import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable} from 'rxjs';
import {Router} from "@angular/router";
import { Subject } from "rxjs";

export interface UserLogin {
  token: string;
}
export interface UserSignup {
  _id: string;
  name: string;
  login:string;
  password:string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private authenticatedSub = new Subject<boolean>();
    constructor(
      private router: Router,
      private http: HttpClient) { }
  signup(name:string, login:string, password:string): Observable<UserSignup> {
    return this.http.post<UserSignup>(`${this.apiUrl}/auth/signup`, {name, login, password})
  }
  login(login:string, password:string): void /*Observable<UserLogin>*/ {
    console.log(`${this.apiUrl}/auth/signin`, {login, password});
    this.http.post<UserLogin>(`${this.apiUrl}/auth/signin`, {login, password})
      .subscribe(
        (response) => {
          const authToken = response.token;
          if(authToken){
            this.authenticatedSub.next(true);
            this.saveAuthToken(authToken);
            console.log('Пользователь зарегистрирован');
            this.router.navigate(['/main-boards'], { /*{ relativeTo: this.route }*/
              queryParams: {login: login}
            });
          }
        })
  }
  logout(){
    this.removeAuthToken();
    this.authenticatedSub.next(false);
    this.router.navigate(['/home']);
  }
  saveAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
  refreshAuthToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {});
  }
  removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }
  isAuthenticated(): boolean {
    const authToken = localStorage.getItem('authToken');
    return !!authToken;
  }
  getAuthenticatedSub(){
    return this.authenticatedSub.asObservable();
  }
  getUsers(): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.get(`${this.apiUrl}/users`, { headers });
  }
}

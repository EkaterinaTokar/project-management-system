import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {Observable, tap} from 'rxjs';
import {Router} from "@angular/router";
import { Subject } from "rxjs";
import {ErrorService} from "../error/services/error.service";

export interface UserLogin {
  token: string;
}
export interface UserSignup {
  _id: string;
  name: string;
  login:string;
  password:string;
}
export interface UserDetails {
  login: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://final-task-backend-production-d6a0.up.railway.app';
  private authenticatedSub = new Subject<boolean>();
  updatedProfileDataEvent: EventEmitter<any> = new EventEmitter<any>();
    constructor(
      private router: Router,
      private http: HttpClient,
      private errorService:ErrorService
      ) { }
  signup(name:string, login:string, password:string): Observable<UserSignup> {
    return this.http.post<UserSignup>(`${this.apiUrl}/auth/signup`, {name, login, password})
  }
  login(login:string, password:string): void {
    this.http.post<UserLogin>(`${this.apiUrl}/auth/signin`, {login, password})
      .subscribe(
        (response) => {
          const authToken = response.token;
          if (authToken) {
            this.authenticatedSub.next(true);
            this.saveAuthToken(authToken);
            this.router.navigate(['/main-boards'], {
              queryParams: {login: login}
            });
          }
        },
        (error: HttpErrorResponse) => {
          const errorMessage = 'Error occurred during processing';
          this.errorService.openDialog(errorMessage);
       }
    );
  }
  logout(){
    this.removeAuthToken();
    localStorage.removeItem('userId');
    localStorage.removeItem('password');
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
  getUser(userId:string):Observable<any>{
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.get(`${this.apiUrl}/users/${userId}`, { headers });
  }
  updateUser(userId:string, name:string, login:string, password:string):Observable<UserDetails>{
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.put<UserDetails>(`${this.apiUrl}/users/${userId}`,{name, login, password}, { headers })
      .pipe(
        tap((response: any) => {
          this.updatedProfileDataEvent.emit(response);
        })
      );
  }
}

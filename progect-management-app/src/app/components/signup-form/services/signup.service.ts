import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";


export interface User {
  name: string;
  login:string;
  //email: string;
  password:string;
}
@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = 'http://localhost:3000'
  constructor(
    private http: HttpClient,
  ) {}

  /*getData() {
    return this.http.get('user.json')
  }*/
  signup(name:string, login:string, /*email:string,*/ password:string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/signup`, {name, login, /*email,*/ password})
  }
}

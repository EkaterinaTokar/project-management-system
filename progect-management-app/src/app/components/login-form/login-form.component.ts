import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router,ActivatedRoute} from "@angular/router";
import {LoginService} from "./services/login.service";
import {first} from "rxjs";


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, NgIf],
})
export class LoginFormComponent implements OnInit{
  loginForm!:FormGroup;
  hide = true;
  constructor(
    private route: ActivatedRoute,
    private login: LoginService,
    private router: Router
  ) {
  }
  ngOnInit():void {
    this.loginForm = new FormGroup({
      'login': new FormControl('',[Validators.required]),
      'password': new FormControl('',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)])
    })
  }
  errorMessageLogin():string {
    const loginControl = this.loginForm.get('login');
    if (loginControl && loginControl.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
  errorMessagePassword(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl && passwordControl.hasError('required')) {
      return 'You must enter a value';
    }
    if (passwordControl && passwordControl.hasError('pattern')) {
      return 'Minimum 8 characters, at least one letter and one number';
    }
    return '';
  }
  submit(){
   const form = this.loginForm.value;
    if (form.login && form.password) {
      this.login.login(form.email, form.password)
        .pipe(first())
        .subscribe({
            next: ()=>{
              console.log("User is logged in");
              const getUrl = this.route.snapshot.queryParams['getUrl'] || '/';
              this.router.navigateByUrl('/');//page boards
            }
          }
        );
    }
 console.log(this.loginForm.value)
  }
}

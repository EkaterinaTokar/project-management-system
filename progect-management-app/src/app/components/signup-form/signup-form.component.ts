import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {Router, ActivatedRoute} from "@angular/router";
import {SignupService} from "./services/signup.service";
import { tap } from 'rxjs';
import {first} from "rxjs";

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  standalone:true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    FormsModule, ReactiveFormsModule, NgIf],
})
export class SignupFormComponent implements OnInit{
  signupForm!:FormGroup;
  hide = true;

  constructor(
    private route: ActivatedRoute,
    private signup: SignupService,
    private router: Router
  ) {
  }
  ngOnInit():void {
    this.signupForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'login': new FormControl('', [Validators.required]),
      //'email':new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required])
    })
  }
  errorMessageName():string{
    const nameControl = this.signupForm.get('name');
    if (nameControl && nameControl.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
  errorMessageLogin():string {
    const loginControl = this.signupForm.get('login');
    if (loginControl && loginControl.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
  /*errorMessageEmail():string{
    const emailControl = this.signupForm.get('email');
    if (emailControl && emailControl.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }*/
  errorMessagePassword():string{
    const passwordControl = this.signupForm.get('password');
    if (passwordControl && passwordControl.hasError('required')) {
      return 'You must enter a value';
    }
    if (passwordControl && passwordControl.hasError('pattern')) {
      return 'Minimum 8 characters, at least one letter and one number';
    }
    return '';
  }
  onSignup() {
      const form = this.signupForm.value;
      if (form.name && form.login && form.password) {
        this.signup.signup(form.name, form.login, /*form.email,*/ form.password)
          .pipe(first())
          .subscribe({
              next: ()=>{
                console.log("User is logged in");
                this.router.navigate(['/main-boards'],{ relativeTo: this.route });
              }
            }
          );
      }
      console.log(this.signupForm.value)
    /*this.router.navigate(['/main-boards']);*/
  }
  /*loadData() {
    let name = this.signupForm.controls.name.value;
    this.signup.signup(name)
      .pipe(
        tap(() => {
          this.router.navigate(['/main-boards']);
        })
      )
      .subscribe();
  }*/
}

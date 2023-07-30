import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "../services/auth.service";

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
    private signup: AuthService,
    private router: Router
  ) {
  }
  ngOnInit():void {
    this.signupForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'login': new FormControl('', [Validators.required]),
      'password': new FormControl('',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        ]),
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
  errorMessagePassword():string{
    const passwordControl = this.signupForm.get('password');
    if (passwordControl && passwordControl.hasError('required')) {
      return 'You must enter a value';
    }
    if (passwordControl && passwordControl.hasError('pattern')) {
      return 'Min 8 chars, at least 1 letter & 1 number';
    }
    return '';
  }

  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }
    const form = this.signupForm.value;
    if (form.name && form.login && form.password) {
      this.signup.signup(form.name, form.login, form.password)
        .subscribe(
          (response) => {
            console.log("User is signup");
            this.router.navigate(['/login-form']);
        });
    }
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {UserDetails} from "../services/auth.service"
import {FormGroup, FormBuilder, Validators} from "@angular/forms"
import {AuthService} from "../services/auth.service"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profileForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public profile: UserDetails,
    public dialogRef: MatDialogRef<ProfileComponent>,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.formBuilder.group({
      name: [profile.name, Validators.required],
      login: [profile.login, Validators.required],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    if (this.profileForm.valid) {
      const updatedDataUser = {
        name: this.profileForm.value.name,
        login: this.profileForm.value.login,
      };
      this.dialogRef.close(updatedDataUser);
    }
  }
}

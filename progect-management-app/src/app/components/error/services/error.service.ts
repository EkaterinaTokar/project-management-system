import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from "../error.component";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private dialog: MatDialog) { }
  openDialog(message: string) {
    this.dialog.open(ErrorComponent, {
      data: { message: message }
    });
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {MatDialogModule} from "@angular/material/dialog";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { MainBoardsComponent } from './components/main-boards/main-boards.component';
import {AuthInterceptorInterceptor} from "./components/services/auth-interceptor.interceptor";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ColumnFormComponent } from './components/dashboard/column-form/column-form.component';
import { TaskFormComponent } from './components/dashboard/task-form/task-form.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainBoardsComponent,
    DashboardComponent,
    DialogComponent,
    ColumnFormComponent,
    TaskFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    LoginFormComponent,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    SignupFormComponent,
    HttpClientModule,
    FormsModule,
    MatDialogModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

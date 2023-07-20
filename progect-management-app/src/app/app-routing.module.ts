import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {SignupFormComponent} from "./components/signup-form/signup-form.component";
import {MainBoardsComponent} from "./components/main-boards/main-boards.component";



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login-form', component: LoginFormComponent },
  { path: 'signup-form', component: SignupFormComponent },
  { path: 'main-boards', component: MainBoardsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

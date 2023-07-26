import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authenticationSub: Subscription = new Subscription();
  userAuthenticated = false;
  constructor(
    private authService:AuthService,
    private router: Router) { }
  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }
  ngOnInit(): void {
    this.userAuthenticated = this.authService.isAuthenticated();
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
    })

  }
  goToHome() {
    this.router.navigate(['/home']);
  }
  logout(){
    this.authService.logout();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authenticationSub: Subscription = new Subscription();
  userAuthenticated = false;
  currentLanguage: string;

  constructor(
    private authService:AuthService,
    private router: Router,
    private translate: TranslateService
    ) {
    this.currentLanguage = this.translate.currentLang || 'en';
  }
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
  switchLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ru' : 'en';
    this.translate.use(this.currentLanguage);
  }
}

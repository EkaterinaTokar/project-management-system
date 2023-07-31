import {Component, OnInit, HostListener, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService, UserDetails} from "../services/auth.service";
import {Subscription} from "rxjs";
import { TranslateService } from '@ngx-translate/core';
import {MatDialog} from "@angular/material/dialog"
import {ProfileComponent} from "../profile/profile.component";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authenticationSub: Subscription = new Subscription();
  userAuthenticated = false;
  currentLanguage: string;
  userIdProf!: string | null;
  userIdPassword!: string |null;
  @Output() updatedProfileDataEvent: EventEmitter<UserDetails> = new EventEmitter();
  isMenuOpen: boolean = false;
  isMobileScreen: boolean = false;


  constructor(
    private authService:AuthService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog,

    ) {
    this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.checkScreenSize();
  }
  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }
  ngOnInit(): void {
    this.userAuthenticated = this.authService.isAuthenticated();
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
    })
    this.translate.use(this.currentLanguage);
  }
  goToHome() {
    this.router.navigate(['/home']);
  }
  logout(){
    this.authService.logout();
  }
  switchLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ru' : 'en';
    localStorage.setItem('selectedLanguage', this.currentLanguage);
    this.translate.use(this.currentLanguage);
  }
  openProfile(){
    this.userIdProf = localStorage.getItem('userId');
    this.userIdPassword = localStorage.getItem('password');
    if(this.userIdProf && this.userIdPassword){
            this.authService.getUser(this.userIdProf!)
              .subscribe(
                (response) => {
                  const dialogRef = this.dialog.open(ProfileComponent, {
                    data: {
                      name: response.name,
                      login: response.login
                    }
                  });
                  dialogRef.afterClosed()
                    .subscribe((response)=>{
                        this.authService.updateUser(
                          this.userIdProf!,
                          response.name,
                          response.login,
                          this.userIdPassword!)
                          .subscribe((res)=> {
                      })
                })
         })
    }

  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileScreen = window.innerWidth < 760;
    if (this.isMobileScreen && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
}

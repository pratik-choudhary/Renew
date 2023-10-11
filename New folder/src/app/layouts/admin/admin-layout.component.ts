import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from 'app/services/api.service';


import { TranslateService } from 'ng2-translate/ng2-translate';
import { AuthGuard } from 'app/services/auth-guard';
@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  private _router: Subscription;
  //apk_link = "https://uat-mob.suzlon.com/hoto_be/data/Apk/Hoto.apk";
  apk_link = "https://mob.suzlon.com/hoto_be/data/Apk/Hoto.apk";
  today: number = Date.now();
  url: string;
  showSettings = false;
  dark: boolean;
  boxed: boolean;
  user_info: any;
  collapseSidebar: boolean;
  compactSidebar: boolean;
  currentLang = 'en';
  version:any;
  @ViewChild('sidemenu') sidemenu;
  @ViewChild('root') root;

  constructor(private router: Router, public menuItems: MenuItems, public translate: TranslateService,private auth_service: AuthGuard ,private api_service: ApiService) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    this.user_info = this.auth_service.getUserInfo();
  }

  getMobileAppVersion() {
    this.api_service.getMobileAppVersion().subscribe(
      data => {
        this.version = data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });

  }

  ngOnInit(): void {
    this.getMobileAppVersion();
    const elemSidebar = <HTMLElement>document.querySelector('.app-inner > .sidebar-panel');
    const elemContent = <HTMLElement>document.querySelector('.app-inner > .mat-sidenav-content');
    this.collapseSidebar = false;
    this.compactSidebar = false;
    // if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
    //   Ps.initialize(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
    //   Ps.initialize(elemContent, { wheelSpeed: 2, suppressScrollX: true });
    // }

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      this.url = event.url;
      if (this.isOver()) {
        this.sidemenu.close();
      }

      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac() && !this.compactSidebar) {
       // Ps.update(elemContent);
      }
    });

    console.log(this.user_info);
  }
   
  ngAfterViewInit() {
    this.root.dir = 'ltr';
  }

  @HostListener('click', ['$event'])
  onClick(e: any) {
    const elemSidebar = <HTMLElement>document.querySelector('.app-inner > .sidebar-panel');
    setTimeout(() => {
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac() && !this.compactSidebar) {
        //Ps.update(elemSidebar);
      }
    }, 350);
  }

  ngOnDestroy() {
    this._router.unsubscribe();
  }

  isOver(): boolean {
    if (this.url === '/apps/messages' || this.url === '/apps/calendar' || this.url === '/apps/media' || this.url === '/maps/leaflet') {
      return true;
    } else {
      return window.matchMedia(`(max-width: 960px)`).matches;
    }
  }

  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }

  menuMouseOver(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
      this.sidemenu.mode = 'over';
    }
  }

  menuMouseOut(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
      this.sidemenu.mode = 'side';
    }
  }

  // addMenuItem(): void {
  //   this.menuItems.add({
  //     state: 'menu',
  //     name: 'MENU',
  //     type: 'sub',
  //     icon: 'trending_flat',
  //     children: [
  //       {state: 'menu', name: 'MENU'},
  //       {state: 'timelmenuine', name: 'MENU'}
  //     ]
  //   });
  // }

  signOut() {
      localStorage.clear();
      this.auth_service.setUserInfo(undefined);      
      this.router.navigate(['/session/signin']);
  }
}

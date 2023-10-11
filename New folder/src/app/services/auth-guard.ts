import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from 'app/services/api.service';

@Injectable()
export class AuthGuard implements CanActivate {
    private user_info: any;
    constructor(private api_service: ApiService,private router: Router) {

     }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('UserToken')) {
            // logged in so return true
            if(this.user_info)
                return true;
            else{
                var info =this.api_service.getUserInformation(JSON.parse(localStorage.getItem('UserToken')).token);
                this.setUserInfo(JSON.parse(info));
                return true;
            }    
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/session/signin'], { queryParams: { returnUrl: state.url }});
        return false;
    }
    getUserInfo(){
        return this.user_info;
    }
    setUserInfo(info: any){
        this.user_info = info;
    }
}
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
                // var info = {
                //     "team": [],
                //     "user_id": 212,
                //     "name": "PM",
                //     "firstName": null,
                //     "lastName": null,
                //     "department": "PMO",
                //     "department_id": 13,
                //     "role": "PM",
                //     "employee_id": null,
                //     "is_dashboard_user": true,
                //     "employeeId": null,
                //     "employeeName": null,
                //     "codeValue": null,
                //     "employeeEmail": "t.pm",
                //     "status": null,
                //     "password": null
                // }
              // this.setUserInfo(info);
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
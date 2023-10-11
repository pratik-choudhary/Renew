import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params  } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthGuard } from 'app/services/auth-guard';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  timeoutFlag = false;
  currentUser:any;
  message:any;
  public form: FormGroup;
  error_msg = false;
  sub:any;
  error:any;
  msgs=[];
  constructor(private fb: FormBuilder,
    private router: Router,
    private route:ActivatedRoute,
    private api_service: ApiService,
    private auth_service: AuthGuard) {
      if (localStorage.getItem('UserToken')) {
          this.router.navigate ( [ '/site-dashboard' ] );
      }
        this.error_msg = false;
    }

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] , password: [null , Validators.compose ( [ Validators.required ] )]
    } );
    this.sub = this.route
    .queryParams
    .subscribe(params => {
        this.error = params['error'];
          
    });
     
  if(this.error == "timeout")
  {
    this.auth_service.setUserInfo(undefined);
    this.timeoutFlag = true;
    this.msgs.push({severity:'info', summary:'Session timed out', detail:'Please login'});      
  } 
  if(this.error == "Unauthorized")
  {
    this.timeoutFlag = true;
    this.msgs.push({severity:'info', summary:'Unauthorized', detail:'User not allowed'});
  }

  }

  onSubmit() {
    let email = this.form.value.uname;
    let pass = this.form.value.password;

    this.api_service.getUsersAuth(email, pass).subscribe(data => {
      
      if (data) {
         localStorage.setItem('UserToken', JSON.stringify({ token: data.access_token}));
         //this.api_service.generateLocationDPRDashboard().subscribe(data=>{},err=>{});
         //this.api_service.generateHOTODashboard().subscribe(data=>{},err=>{});
         //this.api_service.generateDPRDashboard().subscribe(data => {},err=>{});             
         this.router.navigate ( [ '/site-dashboard' ] );
       }
    },
    err => {
      var str = JSON.parse(err['_body']);
      this.message = str.error_description;
      this.error_msg = true;
    });
  }

}

import { Component ,OnInit, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from "@angular/router";
import { ApiService } from 'app/services/api.service';
import { Observable } from 'rxjs/Observable';
import { AuthGuard } from 'app/services/auth-guard';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.scss']
})
export class ReportComponent implements OnInit {
    reports=[
        {
            "sr_no":'1',
            "checkpoint_details":[{"question":"1.Cables pre-laid in Intermediate section 4 - Bottom (Lattice structure)"},{"question":"2.Handling  radius  of Cable"},{"question":"3.Clamp torque"},{"question":"4. Transformer cable Tie up"}],
            "required_value":[{"questions":["a)Clean, No damage & twist","b)No sharp edge touching"],"serial_no":"1"},{"questions":[" Min. 8 times of Cable OD (Outer diameter)"],"serial_no":"2"},{"questions":[" a)Aluminium Cable-25Nm","b)Torque mark visible"],"serial_no":"3"},{"questions":["a)Tie with Nylon rope","b)PVC sheet at sharp edge if any"],"serial_no":"4"}],
            "ok":"1",
            "notok":"1",
            "actual":"ok",
            "correction_record":"ok"
        },
        {
            "sr_no":'2',
            "checkpoint_details":[{"question":"1.Cables pre-laid in Intermediate section 4 - Bottom (Lattice structure)"},{"question":"2.Handling  radius  of Cable"},{"question":"3.Clamp torque"},{"question":"4. Transformer cable Tie up"}],
            "required_value":[{"questions":["a)Clean, No damage & twist","b)No sharp edge touching"],"serial_no":"1"},{"questions":[" Min. 8 times of Cable OD (Outer diameter)"],"serial_no":"2"},{"questions":[" a)Aluminium Cable-25Nm","b)Torque mark visible"],"serial_no":"3"},{"questions":["a)Tie with Nylon rope","b)PVC sheet at sharp edge if any"],"serial_no":"4"}],
            "ok":"1",
            "notok":"1",
            "actual":"ok",
            "correction_record":"x"
        }
    ];
    currentUser:any;
    encapsulation: ViewEncapsulation.None ;
    constructor(public fb: FormBuilder, private router: Router,  private api_service: ApiService,private auth_service: AuthGuard)
    {

    }
    ngOnInit(): void {
        this.currentUser = this.auth_service.getUserInfo();
        this.currentUser.role = this.currentUser.role.toString().toLowerCase();
    }
}

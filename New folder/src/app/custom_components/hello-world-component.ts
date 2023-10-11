import {Component, Injector} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'hello-world',
  templateUrl: `./component.html`,
  styleUrls:['./components.scss']
})
export default class HelloWorldComponent {
  showNum = 0;
  public form: FormGroup;
  constructor(private injector: Injector,private fb: FormBuilder) {
    this.showNum = this.injector.get('showNum');
    this.form = this.fb.group({
     DESCRIPTION: [this.injector.get('item').ITEM_DESCRIPTION, Validators.required],
     REQUIRED_VALUE: [null, Validators.required]
    });
    //this.form.value.DESCRIPTION = this.injector.get('item').ITEM_DESCRIPTION;
  }
  saveComponent(){
    var obj: {[k: string]: any} = {};
    obj.DESCRIPTION = this.form.value.DESCRIPTION;
    obj.REQUIRED_VALUE = this.form.value.REQUIRED_VALUE;
    obj.COMPONENT = 'HelloWorldComponent';
  }
}

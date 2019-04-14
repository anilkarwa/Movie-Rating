import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup,Validators } from '@angular/forms';
import {DataServiceService} from '../../data-service.service';
import {observable, Subscriber} from 'rxjs';
import { error } from '@angular/compiler/src/util';
import {Router } from  '@angular/router';
import {SnackbarService} from 'ngx-snackbar';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  registrationForm : FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private _http : DataServiceService, private route : Router,
    private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registrationForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registrationForm.invalid) {
        return;
    }
     this._http.registerUser(this.registrationForm.controls['name'].value,this.registrationForm.controls['email'].value,this.registrationForm.controls['password'].value)
     .subscribe(result =>{
        if(result.status == 201){
          
          this.registrationForm.reset();
          this.snackBar(result.message,'#27AE60');
        }else{
          this.snackBar(result.message,'#E12931');
        }
     },(error) =>{
      this.snackBar(error.statusText,'#E12931');
     })
  }

  snackBar(message,bgColor){
    const _this = this;
    this.snackbarService.add({
      msg: message,
      timeout: 5000,
      background: bgColor,
      action: {
        text: ''
      },
    });     
  }

}

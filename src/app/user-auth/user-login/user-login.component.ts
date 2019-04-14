import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {DataServiceService} from '../../data-service.service';
import {observable, Subscriber} from 'rxjs';
import { error } from '@angular/compiler/src/util';
import {Router} from '@angular/router';
import {SnackbarService} from 'ngx-snackbar';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  loginForm :FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private _http:DataServiceService,private route: Router,
     private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this._http.loginUser(this.loginForm.controls['email'].value,this.loginForm.controls['password'].value).subscribe( result=>{
       console.log(JSON.stringify(result));
       if(result.status ==200){
         localStorage.setItem('loggedInUserId',result.id);
         localStorage.setItem('loggedInUserName',result.name);
         localStorage.setItem('accessToken',result.token);
         this.route.navigate(['/movies']);
       }else{
         this.snackBar(result.message,'#E12931');
       }
    },
    (error) =>{
      this.snackBar(error.statusText,'#E12931');
    });

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

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private route : Router){
  }

  canActivate(  next :ActivatedRouteSnapshot, state : RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean{
     let authkey = localStorage.getItem('accessToken') || 0;
     if(authkey){
       return true;
     } else{
       this.route.navigate(['/notfound']);
       return false;
     }
    }
}

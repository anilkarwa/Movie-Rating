import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';



const httpOptions = {
  headers: new HttpHeaders({
    'Client-Service':'frontend-angular',
    'Auth-Key': 'movieratingappforcodemax',
    'Content-Type' : 'application/x-www-form-urlencoded'
  })
};

const API_URL = environment.serviceUlr;


@Injectable()
export class DataServiceService {

  constructor(private http : HttpClient) { }

  public loginUser(username,password): Observable<any>{
    return this.http.post(API_URL + 'auth/login?username='+username+'&password='+password,{},httpOptions);
  }

  public registerUser(name,email,password): Observable<any>{
    let body  = {user_displayName : name , user_email: email, user_password : password};
    return this.http.post(API_URL + 'auth/register',body,httpOptions);
  }

  public getMovieList(pageno,isDesc,sortingColumn,searchValue): Observable<any>{
    return this.http.post(API_URL + 'movie/movielist?pageno='+pageno+'&isDesc='+isDesc+'&sortingColumnName='+sortingColumn+'&searchValue='+searchValue,{},httpOptions);
  }

  public saveUserMovieRating(movie_id,user_id,user_rating): Observable<any>{
    let body  = {movie_id : movie_id,user_id : user_id,user_rating : user_rating};
    return this.http.post(API_URL + 'movie/ratemovie',body,httpOptions);
  }


  public logoutUser(): Observable<any>{
    return this.http.post(API_URL + 'auth/logout',{},httpOptions);
  }
}

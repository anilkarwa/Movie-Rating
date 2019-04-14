import { Component, OnInit } from '@angular/core';
import {DataServiceService} from '../data-service.service';
import {observable, Subscriber} from 'rxjs';
import { error } from '@angular/compiler/src/util';
import {Router} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SnackbarService} from 'ngx-snackbar';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnInit {

  page =1;
  totalItem=0;
  loggedInUserName = localStorage.getItem('loggedInUserName') || '';
  searchValue = '';
  sortingColumnName= '';
  isDesc = true;
  movieListData =[];
  currentRate = 1;
  selectedMovieId = 0;
  userLoggedIn = localStorage.getItem('accessToken') || 0;

  constructor(private _http:DataServiceService,private route: Router,private modalService: NgbModal,
    private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.getMovieList(this.page,this.isDesc,this.sortingColumnName,this.searchValue);
  }

  getMovieList(page,isDesc,sortingColumnName,searchValue){
      this._http.getMovieList(page,isDesc,sortingColumnName,searchValue).
      subscribe(result =>{
        if(result.status== 200){
          this.movieListData = result.data;
          this.totalItem = result.total_records;
        }else{
          this.snackBar(result.message,'#E12931');
        }
      }, (error)=>{
        this.snackBar(error.statusText,'#E12931');
     });

  }
  searchMovieWithName(){
    this.getMovieList(this.page,this.isDesc,this.sortingColumnName,this.searchValue);
  }
  sortByColumn(columnName){
    this.sortingColumnName = columnName;
    this.isDesc = !this.isDesc;
    this.getMovieList(this.page,this.isDesc,this.sortingColumnName,this.searchValue);
  }

  saveRating(){
    
    if(this.userLoggedIn){
        this._http.saveUserMovieRating(this.selectedMovieId,localStorage.getItem('loggedInUserId'),this.currentRate).subscribe( result =>{
          if(result.status == 201){
            this.currentRate = 1;
            this.selectedMovieId = 0;
            this.modalService.dismissAll();
            this.getMovieList(this.page,this.isDesc,this.sortingColumnName,this.searchValue);
            this.snackBar(result.message,'#27AE60');
          }else{
            this.snackBar(result.message,'#E12931');
          }
        },(error) =>{
          this.snackBar(error.statusText,'#E12931');
        })
     } else{
      this.snackBar('Please login to rate movies.','#E12931');
     }
  }

  paginationChange(){
    this.getMovieList(this.page,this.isDesc,this.sortingColumnName,this.searchValue);
  }

  openVerticallyCentered(content) {
    if(this.userLoggedIn){
     this.modalService.open(content, { centered: true });
    } else{
      this.snackBar('Please login to rate movies.','#E12931');
     }
  }

  logoutUser(){
    this._http.logoutUser().subscribe(result =>{
      if(result.status == 200){
        localStorage.clear();
        this.snackBar(result.message,'#27AE60');
        this.route.navigate(['/login']);
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

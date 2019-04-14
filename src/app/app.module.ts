import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-auth/user-login/user-login.component';
import { UserRegistrationComponent } from './user-auth/user-registration/user-registration.component';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataServiceService } from './data-service.service';
import { AuthIntercepters } from './user-auth/auth.intercepter';
import { SnackbarModule } from 'ngx-snackbar';
import { AuthGuard } from './auth.guard';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserRegistrationComponent,
    MoviesListComponent,
    PagenotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,  
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    SnackbarModule.forRoot()
  ],
  providers: [
    DataServiceService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthIntercepters,
      multi :true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
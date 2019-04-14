import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-auth/user-login/user-login.component';
import { UserRegistrationComponent } from './user-auth/user-registration/user-registration.component';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { PagenotfoundComponent} from './pagenotfound/pagenotfound.component'

const routes: Routes = [
  {path:'',redirectTo: '/movies', pathMatch: 'full'},
  {path:'login',component:UserLoginComponent},
  {path:'registration',component: UserRegistrationComponent},
  {path:'movies',component:MoviesListComponent},
  {path:'notfound',component:PagenotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

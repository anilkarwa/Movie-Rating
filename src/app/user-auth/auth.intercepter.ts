import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


export class AuthIntercepters implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next :HttpHandler):Observable<HttpEvent<any>>{
        const token =  localStorage.getItem('accessToken');
        const userid = localStorage.getItem('loggedInUserId');

        if(token){
            const cloned = req.clone({
                headers:req.headers.
                set("Authorization",token)
                .set("User-ID",userid)
            });
            return next.handle(cloned);
        }else{
            return next.handle(req);
        }
    }
}
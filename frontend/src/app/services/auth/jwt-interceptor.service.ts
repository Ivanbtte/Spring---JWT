import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor{

  private excludedUrls = ['/api/v1/files/upload']; // Agrega aquí cualquier URL que no deba tener JWT


  constructor(private loginService: LoginService, private cookieService: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.cookieService.get('token') || this.loginService.userToken;

    if (token && !this.excludedUrls.some(url => req.url.includes(url))) {
      req = req.clone({
        setHeaders: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
      });
    }else{
      req = req.clone({
        setHeaders: {
            'Authorization': `Bearer ${token}`,
          },
      });
    }

    return next.handle(req);
  }
}

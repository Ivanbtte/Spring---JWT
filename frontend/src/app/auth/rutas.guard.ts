import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RutasService } from '../services/rutas/rutas.service';
import { LoginService } from '../services/auth/login.service';

@Injectable({
  providedIn: 'root'
})
export class RutasGuard implements CanActivate {
  constructor(private rutasService: RutasService, private router: Router, private loginService: LoginService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const expectedRoles: string[] = next.data['expectedRoles'];
    const currentRole = this.loginService.getUserRole();

    if (expectedRoles.includes(currentRole)) {
      return true;
    } else {
      this.router.navigate(['/no-authorized']);
      return false;
    }
  }
}
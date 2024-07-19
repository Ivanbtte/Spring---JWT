import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RutasService } from '../services/rutas/rutas.service';

@Injectable({
  providedIn: 'root'
})
export class RutasGuard implements CanActivate {
  constructor(private rutasService: RutasService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const expectedRoles: string[] = next.data['expectedRoles'];
    const currentRole = this.rutasService.getRole();

    if (expectedRoles.includes(currentRole)) {
      return true;
    } else {
      this.router.navigate(['/no-authorized']);
      return false;
    }
  }
}
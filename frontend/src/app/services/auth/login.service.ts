import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import  {  Observable, throwError, catchError, BehaviorSubject , tap, map} from 'rxjs';
import { User } from './user';
import { environment } from 'src/environments/environment';
import { EncryptionServiceService } from './encryption-service.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> =new BehaviorSubject<String>("");

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionServiceService,
    private cookieService: CookieService // Inyecta el servicio de cookies
  ) { 
    const token = this.cookieService.get('token') || sessionStorage.getItem('token');
    this.currentUserLoginOn = new BehaviorSubject<boolean>(!!token);
    this.currentUserData = new BehaviorSubject<String>(token || '');
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(environment.urlHost + "auth/login", credentials).pipe(
      tap((userData) => {
        const encryptedRole = this.encryptionService.encrypt(userData.role);
        const encryptedInstituto = this.encryptionService.encrypt(String(userData.instituto));
        const encryptedId = this.encryptionService.encrypt(String(userData.id));

       // Guardar en sessionStorage
        sessionStorage.setItem("token", userData.token);
        sessionStorage.setItem("role", encryptedRole);
        sessionStorage.setItem("_biz_s_t_y", encryptedInstituto);
        sessionStorage.setItem("_biz_v_e_z", encryptedId);

        // Guardar en cookies
        this.cookieService.set('token', userData.token);
        this.cookieService.set('role', encryptedRole);
        this.cookieService.set('_biz_s_t_y', encryptedInstituto);
        this.cookieService.set('_biz_v_e_z', encryptedId);

        this.currentUserData.next(userData.token);
        this.currentUserLoginOn.next(true);
        this.setUserId(userData.id); 
      }),
      map((userData) => ({ token: userData.token, role: userData.role })), // Devolver ambos valores
      catchError(this.handleError)
    );
  }
  logout(): void {
    // Eliminar de sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("_biz_s_t_y");
    sessionStorage.removeItem("_biz_v_e_z");

    // Eliminar de cookies
    this.cookieService.delete('token');
    this.cookieService.delete('role');
    this.cookieService.delete('_biz_s_t_y');
    this.cookieService.delete('_biz_v_e_z');

    this.currentUserLoginOn.next(false);
  }

  private handleError(error:HttpErrorResponse){
    if(error.status===0){
      console.error('Se ha producio un error ', error.error);
    }
    else{
      console.error('Backend retornó el código de estado ', error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }

  get userData():Observable<String>{
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }

  get userToken():String{
    return this.currentUserData.value;
  }
  getUserRole(): string {
    const role = this.cookieService.get('role') || sessionStorage.getItem('role');
    return this.encryptionService.decrypt(role || '');
  }
  getInstituto(): string {
    const instituto = this.cookieService.get('_biz_s_t_y') || sessionStorage.getItem('_biz_s_t_y');
    return this.encryptionService.decrypt(instituto || '');
  }
  getId(): string {
    const id = this.cookieService.get('_biz_v_e_z') || sessionStorage.getItem('_biz_v_e_z');
    return this.encryptionService.decrypt(id || '');
  }

  setUserId(id: number): void {
    this.userIdSubject.next(id);
  }

  getUserId(): Observable<number | null> {
    return this.userIdSubject.asObservable();
  }
  
}
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import  {  Observable, throwError, catchError, BehaviorSubject , tap, map} from 'rxjs';
import { User } from './user';
import { environment } from 'src/environments/environment';
import { EncryptionServiceService } from './encryption-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> =new BehaviorSubject<String>("");

  constructor(private http: HttpClient, private encryptionService: EncryptionServiceService) { 
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null);
    this.currentUserData=new BehaviorSubject<String>(sessionStorage.getItem("token") || "");
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(environment.urlHost + "auth/login", credentials).pipe(
      tap((userData) => {
        const encryptedRole = this.encryptionService.encrypt(userData.role);
        const encryptedInstituto = this.encryptionService.encrypt(userData.instituto);
        sessionStorage.setItem("token", userData.token);
        sessionStorage.setItem("role", encryptedRole);
        sessionStorage.setItem("instituto", encryptedInstituto);
        this.currentUserData.next(userData.token);
        this.currentUserLoginOn.next(true);
      }),
      map((userData) => ({ token: userData.token, role: userData.role })), // Devolver ambos valores
      catchError(this.handleError)
    );
  }
  logout(): void {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role"); // Quitar el rol del sessionStorage
    sessionStorage.removeItem("instituto");
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
    return this.encryptionService.decrypt(sessionStorage.getItem("role") || ""); 
  }
  getInstituto(): string {
    return this.encryptionService.decrypt(sessionStorage.getItem("instituto") || ""); 
  }

}
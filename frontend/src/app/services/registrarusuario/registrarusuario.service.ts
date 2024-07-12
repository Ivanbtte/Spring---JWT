import { Injectable } from '@angular/core';
import { registrarusuarioRequest } from './registrarusuarioRequest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrarusuarioService {

  private apiUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) { }

  registro(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }
}

import { Injectable } from '@angular/core';
import { registrarusuarioRequest } from './registrarusuarioRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrarusuarioService {

  private apiUrl = 'http://localhost:8080/api/v1/user';
  private apiAutorUrl = 'http://localhost:8080/api/v1/autor';
  private apiInvestigadorUrl = 'http://localhost:8080/api/v1/investigador';

  constructor(private http: HttpClient) { }

  registro(user: registrarusuarioRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  registroAutor(autor: any): Observable<any> {
    return this.http.post<any>(this.apiAutorUrl, autor);
  }

  registroInvestigador(investigador: any): Observable<any> {
    return this.http.post<any>(this.apiInvestigadorUrl, investigador);
  }

  /*reporte() {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });
    return this.http.get(this.apiUrl + "/exportarPDF", { headers, responseType: 'blob' });
  }

  reporteExe() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return this.http.get(this.apiUrl + "/exportarExel", { headers, responseType: 'blob' });
  }*/
}

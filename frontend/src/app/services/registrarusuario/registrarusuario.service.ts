import { Injectable } from '@angular/core';
import { registrarusuarioRequest } from './registrarusuarioRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrarusuarioService {

  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) { }

  registro(user: registrarusuarioRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl+'user', user);
  }

  registroAutor(autor: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'autor', autor);
  }

  registroInvestigador(investigador: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'investigador', investigador);
  }

  getInstitutos(): Observable<any> {
    return this.http.get<any>(this.apiUrl+'instituto'); // Método para obtener institutos
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

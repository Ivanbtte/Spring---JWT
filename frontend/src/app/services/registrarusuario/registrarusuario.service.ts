import { Injectable } from '@angular/core';
import { registrarusuarioRequest } from './registrarusuarioRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../auth/user';
import { AutorRequest } from './autor';
import { Investigador } from './Investigador';

@Injectable({
  providedIn: 'root'
})
export class RegistrarusuarioService {

  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) { }

  registro(user: registrarusuarioRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'user', user);
  }

  registroAutor(autor: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'autor', autor);
  }

  registroInvestigador(investigador: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'investigador', investigador);
  }

  getInstitutos(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'instituto'); // Método para obtener institutos
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/${userId}`);
  }

  getAutorById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}autor/${userId}`);
  }

  getInvestigadorById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}investigador/${userId}`);
  }

  getAutorByIds(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}investigadorUser/${userId}`);
  }

  updateUser(userId: number, user: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}user/${userId}`, user);
  }

  updateUserPass(userId: number, user: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}user/${userId}`, user);
  }
  
  updateAutor(userId: number, autor: AutorRequest): Observable<AutorRequest> {
    return this.http.put<AutorRequest>(`${this.apiUrl}autor/${userId}`, autor);
  }

  updateInvestigador(investigadorId: number, investigador: Investigador): Observable<Investigador> {
    return this.http.put<Investigador>(`${this.apiUrl}investigador/${investigadorId}`, investigador);
  }

  /*updateInvestigador(userId: number, user: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}investigador/${userId}`, user);
  }
  */

  /*reporte() {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });
    return this.http.get(this.apiUrl + "/exportarPDF", { headers, responseType: 'blob' });
  }*/

  /*  reporteExe() {
      const headers = new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      return this.http.get(this.apiUrl + "/exportarExel", { headers, responseType: 'blob' });
    }*/
}

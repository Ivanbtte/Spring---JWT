import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  private apiUrl = 'http://localhost:8080/api/v1/articulos';

  constructor(private http: HttpClient) { }

  getList(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlApi + 'articulo').pipe(
      catchError(this.handleError)
    )
  }
  searchPublications(criteria: any): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'articulo', criteria);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status == 0) {
      console.error('Se ha producido un error ', error.status, error.error);
    }
    else {
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }

  reporte() {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });
    return this.http.get(this.apiUrl + "/exportarPDF", { headers, responseType: 'blob' });
  }

  reporteExe() {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return this.http.get(this.apiUrl + "/exportarExcel_Instituto", { headers, responseType: 'blob' });
  }

  reporteExe_Instituto(id: number) {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return this.http.get(`${this.apiUrl}/exportarExel/${id}`, { headers, responseType: 'blob' });
  }

  reporteExe_Instituto_Investigador(institutoId: number, profesorId: number) {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return this.http.get(`${this.apiUrl}/exportarExcel_Instituto_Investigador/${institutoId}/${profesorId}`, { headers, responseType: 'blob' });
  }

  reporteExe_Instituto_TipoPublicacion(institutoId: number, tipo_publicacionId: number) {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return this.http.get(`${this.apiUrl}/exportarExcel_Instituto_TipoPublicacion/${institutoId}/${tipo_publicacionId}`, { headers, responseType: 'blob' });
  }
}

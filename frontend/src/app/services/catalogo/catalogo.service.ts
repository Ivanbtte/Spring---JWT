import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tipoRequest } from './tipoRequest';
import { trimestreRequest } from './trimestreRequest';
import { institutoRequest } from './institutoRequest';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private apiUrlTrimestre = 'http://localhost:8080/api/v1/trimestre';
  private apiUrlInstituto = 'http://localhost:8080/api/v1/instituto';
  private apiUrlTipoPublicacion = 'http://localhost:8080/api/v1/tipo_Publicacion';
  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) { }

  addTrimestre(trimestre: trimestreRequest): Observable<any> {
    return this.http.post<any>(this.apiUrlTrimestre, trimestre);
  }

  addInstituto(instituto: institutoRequest): Observable<any> {
    return this.http.post<any>(this.apiUrlInstituto, instituto);
  }

  addTipoPublicacion(tipoPublicacion: tipoRequest): Observable<any> {
    return this.http.post<any>(this.apiUrlTipoPublicacion, tipoPublicacion);
  }

  getTrimestres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}trimestre`).pipe(
      catchError(this.handleError)
    );
  }

  getInstitutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}instituto`).pipe(
      catchError(this.handleError)
    );
  }

  getTiposPublicacion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}tipo_Publicacion`).pipe(
      catchError(this.handleError)
    );
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}upload`, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else {
      console.error('Backend retornó el código de estado:', error.status, error.error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }
}
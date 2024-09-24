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

  constructor(private http: HttpClient) { }

  addTrimestre(trimestre: trimestreRequest): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'trimestre', trimestre);
  }

  addInstituto(instituto: institutoRequest): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'instituto', instituto);
  }

  addTipoPublicacion(tipoPublicacion: tipoRequest): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'tipo_Publicacion', tipoPublicacion);
  }

  getTrimestres(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}trimestre`).pipe(
      catchError(this.handleError)
    );
  }

  getInstitutos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}instituto`).pipe(
      catchError(this.handleError)
    );
  }

  getTiposPublicacion(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlApi}tipo_Publicacion`).pipe(
      catchError(this.handleError)
    );
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${environment.urlApi}upload`, formData).pipe(
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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) {}

  getTrimestres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}trimestre`).pipe(
      catchError(this.handleError)
    );
  }

  addTrimestre(trimestre: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}trimestre`, trimestre).pipe(
      catchError(this.handleError)
    );
  }

  getInstitutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}instituto`).pipe(
      catchError(this.handleError)
    );
  }

  addInstituto(instituto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}instituto`, instituto).pipe(
      catchError(this.handleError)
    );
  }

  getTiposPublicacion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}tipo_Publicacion`).pipe(
      catchError(this.handleError)
    );
  }

  addTipoPublicacion(tipoPublicacion: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}tipo_Publicacion`, tipoPublicacion).pipe(
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
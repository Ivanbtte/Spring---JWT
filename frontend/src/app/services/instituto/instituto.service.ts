import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstitutoService {

  constructor(private http: HttpClient) { }

  getList(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlApi + 'instituto').pipe(
      catchError(this.handleError)
    )
  }

  // Método para obtener un instituto por ID (GET)
  getInstituto(id: number): Observable<any> {
    return this.http.get(`${environment.urlApi}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para actualizar un instituto por ID (PUT)
  updateInstituto(id: number, instituto: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${environment.urlApi}${id}`, instituto, { headers }).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status == 0) {
      console.error('Se ha producido un error', error.status, error.error);
    }
    else {
      console.error('Backend retornó el código de estado', error.status, error.error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }
}
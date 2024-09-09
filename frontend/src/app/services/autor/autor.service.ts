import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AutorRequest } from '../registrarusuario/autor';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private apiUrl = 'http://localhost:8080/api/v1/autor';
  private apiUrl1 = 'http://localhost:8080/api/v1';


  constructor(private http: HttpClient) { }


  getAutorByArticuloById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/autores`).pipe(
      catchError(this.handleError)
    );
  }

  getList(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlApi + 'autor').pipe(
      catchError(this.handleError)
    )
  }

  // Método para eliminar la relación entre autor UNSIS y artículo
  eliminarRelacionAutorUnsis(idAutor: number, idArticulo: number): Observable<any> {
    const url = `${this.apiUrl1}/autor-unsis/${idAutor}/articulo/${idArticulo}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  // Método para eliminar la relación entre autor no UNSIS y artículo
  eliminarAutorNoUnsisRelacionado(idAutor: number, idArticulo: number): Observable<any> {
    const url = `${this.apiUrl1}/autor-no-unsis/${idAutor}/articulo/${idArticulo}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  actualizarAutorNoUnsis(id: number, autorDto: AutorRequest): Observable<any> {
    return this.http.put<any>(`${environment.urlApi}autor/${id}`, autorDto).pipe(
      catchError(this.handleError)
    );
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
}

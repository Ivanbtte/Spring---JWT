import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  constructor(private http: HttpClient) {}

  getList(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlApi+'articulo').pipe(
      catchError(this.handleError)
    )
  }
  searchPublications(criteria: any): Observable<any> {
    return this.http.post<any>(environment.urlApi+'articulo', criteria);
  }

  private handleError(error:HttpErrorResponse){
    if(error.status==0){
      console.error('Se ha producido un error ',error.status, error.error);
    }
    else{
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }
}

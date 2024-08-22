import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Investigador } from '../auth/investigador';

@Injectable({
  providedIn: 'root'
})
export class InvestigadorService {

  constructor(private http: HttpClient) { }


  getInvestigadores(): Observable<Investigador[]> {
    return this.http.get<Investigador[]>(`${environment.urlApi}investigador`).pipe(
      catchError(this.handleError)
    );
  }

  getInvestigador(id: number): Observable<Investigador> {
    return this.http.get<Investigador>(`${environment.urlApi}investigador/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createInvestigador(investigador: Investigador): Observable<Investigador> {
    return this.http.post<Investigador>(`${environment.urlApi}investigador`, investigador).pipe(
      catchError(this.handleError)
    );
  }

  updateInvestigador(investigador: Investigador): Observable<Investigador> {
    return this.http.put<Investigador>(`${environment.urlApi}investigador/${investigador.id}`, investigador).pipe(
      catchError(this.handleError)
    );
  }

  deleteInvestigador(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.urlApi}investigador/${id}`).pipe(
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

  getInvestigadorByInstitute(id: number): Observable<Investigador[]> {
    return this.http.get<Investigador[]>(`${environment.urlApi}investigador/instituto/${id}`).pipe(
      catchError(this.handleError)
    );
  }  
}

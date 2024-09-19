import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrimestreService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/v1/trimestre';

  // Método para obtener un trimestre por su ID
  getTrimestre(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }
  // Método para actualizar un trimestre
  updateTrimestre(id: number, trimestre: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Asegurarte de que las fechas están en formato YYYY-MM-DD antes de enviarlas
    const formattedTrimestre = {
      ...trimestre,
      fecha_inicio: this.formatDateForInput(trimestre.fecha_inicio),
      fecha_fin: this.formatDateForInput(trimestre.fecha_fin)
    };

    return this.http.put(`${this.apiUrl}/${id}`, formattedTrimestre, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para formatear las fechas
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Devuelve en formato YYYY-MM-DD
  }

  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('An error occurred:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Devolver un observable con un mensaje de error
    return throwError('Something went wrong; please try again later.');
  }


}

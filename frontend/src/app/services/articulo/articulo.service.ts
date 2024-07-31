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

  // Nuevo método para obtener institutos
  getInstitutos(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlApi + 'instituto').pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener trimestres
  getTrimestres(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlApi + 'trimestre').pipe(
      catchError(this.handleError)
    );
  }

  getList(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlApi + 'articulo').pipe(
      catchError(this.handleError)
    )
  }

  getAutoresPorInstituto(institutoId: string): Observable<any[]> {
    return this.http.get<any[]>(environment.urlApi+'investigador/instituto/' + institutoId);
  }

  searchPublications(criteria: any): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'articulo', criteria);
  }

   // Nuevo método para agregar un autor no UNSIS
   agregarAutorNoUnsis(nuevoAutor: any): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'autor', nuevoAutor).pipe(
      catchError(this.handleError)
    );
  }

  eliminarAutorNoUnsis(autorId: number): Observable<any> {
    return this.http.delete(environment.urlApi+'autor/' + autorId).pipe(
      catchError(this.handleError)
    );
  }

  // Nuevo método para crear un artículo
  crearArticulo(articulo: any): Observable<any> {
    return this.http.post<any>(environment.urlApi+'articulo', articulo).pipe(
      catchError(this.handleError)
    );
  }

  agregarAutorArticulo(articuloId: number, autorId: number): Observable<any> {
    return this.http.post(environment.urlApi+'articulo/'+articuloId+'/autores/'+autorId, {});
  }

  private handleError(error:HttpErrorResponse){
    if(error.status==0){
      console.error('Se ha producido un error ',error.status, error.error);
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

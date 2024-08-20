import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
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
      map(trimestres => {
        // Ordena los trimestres por fecha de inicio descendente
        trimestres.sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime());
        // Filtra para obtener solo los dos últimos trimestres
        return trimestres.slice(0, 2);
      })
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
    return this.http.post<any>(environment.urlApi + 'articulosfiltro', criteria);
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

  agregarObservaciones(observaciones: any, id: string | null): Observable<any>{
    return this.http.put<any>(environment.urlApi+'articulo/observaciones/'+ observaciones.id_articulo, observaciones).pipe(
      catchError(this.handleError)
    );
  }

  agregarAutorArticulo(articuloId: number, autorId: number): Observable<any> {
    return this.http.post(environment.urlApi+'articulo/'+articuloId+'/autores/'+autorId, {});
  }

  getArticuloById(id: number): Observable<any> {
    return this.http.get<any>(environment.urlApi+'articulo/'+id);
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
    return this.http.get(`${this.apiUrl}/exportarExcel`, { headers, responseType: 'blob' });

  }

  reporteExe_Instituto(id: number) {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return this.http.get(`${this.apiUrl}/exportarExcel_Instituto/${id}`, { headers, responseType: 'blob' });
  }

  reporteExe_Profesor(id: number) {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return this.http.get(`${this.apiUrl}/exportarExcel_Profesor/${id}`, { headers, responseType: 'blob' });
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

  reporteExe_Instituto_Investigador_TipoPublicacion(institutoId: number, profesorId: number,tipo_publicacionId: number) {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return this.http.get(`${this.apiUrl}/exportarExcel_Instituto_Investigador_TipoPublicacion/${institutoId}/${profesorId}/${tipo_publicacionId}`, { headers, responseType: 'blob' });
  }
}

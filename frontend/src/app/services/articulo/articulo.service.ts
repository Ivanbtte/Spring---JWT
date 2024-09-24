import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Articulo } from './articulo';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

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
    return this.http.get<any[]>(environment.urlApi + 'investigador/instituto/' + institutoId);
  }

  searchPublications(criteria: any): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'articulos/filtro', criteria);
  }

  dowloadzip(criteria: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log(criteria);
    return this.http.post(environment.urlApi + 'files/download-zip', criteria, {
      headers: headers,
      responseType: 'blob' // Indicamos que la respuesta es un blob
    });
  }


  // Nuevo método para agregar un autor no UNSIS
  agregarAutorNoUnsis(nuevoAutor: any): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'autor', nuevoAutor).pipe(
      catchError(this.handleError)
    );
  }

  eliminarAutorNoUnsis(autorId: number): Observable<any> {
    return this.http.delete(environment.urlApi + 'autor/' + autorId).pipe(
      catchError(this.handleError)
    );
  }

  // Nuevo método para crear un artículo
  crearArticulo(articulo: any): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'articulo', articulo).pipe(
      catchError(this.handleError)
    );
  }

  agregarObservaciones(observaciones: any, id: string | null): Observable<any> {
    return this.http.put<any>(environment.urlApi + 'articulo/observaciones/' + observaciones.id_articulo, observaciones).pipe(
      catchError(this.handleError)
    );
  }

  agregarAutorArticulo(articuloId: number, autorId: number, rolAutor: string): Observable<any> {
    return this.http.post(environment.urlApi + 'articulo/' + articuloId + '/autores/' + autorId, rolAutor).pipe(
      catchError(this.handleError));
  }

  getArticuloById(id: number): Observable<any> {
    return this.http.get<any>(environment.urlApi + 'articulo/' + id);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Error del lado del cliente o de la red
      console.error('Se ha producido un error: ', error.status, error.error);
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar al servidor. Por favor verifique su conexión.',
      });
    } else {
      // El backend devolvió un código de error
      console.error('Backend retornó el código de estado: ', error.status, error.error);
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: `${error.error.message || 'Ocurrió un problema, inténtelo de nuevo.'}`,
      });
    }
    // Retornar el error para que otros servicios puedan manejarlo si es necesario
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }

  actualizarArticulo(id: number, articuloDto: Articulo): Observable<any> {
    return this.http.put<any>(environment.urlApi + 'articulo/' + id, articuloDto).pipe(
      catchError(this.handleError)
    );
  }

  reporte() {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });
    return this.http.get(environment.urlApi + "/exportarPDF", { headers, responseType: 'blob' });
  }

  reporteExe(criterios: any) {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Type': 'application/json' // Aseguramos el tipo de contenido adecuado
    });

    // Enviamos una solicitud POST con los criterios en el cuerpo
    return this.http.post(`${environment.urlApi}articulos/exportarExcel`, criterios, {
      headers: headers,
      responseType: 'blob' // Esto es para manejar la respuesta del archivo binario
    });
  }

}

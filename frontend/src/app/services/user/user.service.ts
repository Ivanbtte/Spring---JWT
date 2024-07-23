import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../auth/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUser(id:number):Observable<User>
  {
      return this.http.get<User>(environment.urlApi+"user/"+id).pipe(
        catchError(this.handleError)
      )
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.urlApi}user`).pipe(
      catchError(this.handleError)
    );
  }
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.urlApi}user`, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${environment.urlApi}user/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.urlApi}user/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  disableUser(id: number): Observable<void> {
    return this.http.put<void>(`${environment.urlApi}user/${id}/disable`, {}).pipe(
      catchError(this.handleError)
    );
  }

  enableUser(id: number): Observable<void> {
    return this.http.put<void>(`${environment.urlApi}user/${id}/enable`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error:HttpErrorResponse){
    if(error.status===0){
      console.error('Se ha producido un error ', error.error);
    }
    else{
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }



}

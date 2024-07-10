import { Injectable } from '@angular/core';
import { registrarusuarioRequest } from './registrarusuarioRequest';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrarusuarioService {

  constructor(private http: HttpClient) { }

  registro(credentials:registrarusuarioRequest){
    console.log("Se ha creado un nuevo usuario"+credentials);
    this.http.get('')
  }
}

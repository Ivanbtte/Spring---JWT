import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }
  private fileToUpdate: File | null = null; // Almacena el archivo a actualizar

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
  
    return this.http.post(`${this.baseUrl}/files/upload`, formData);
  }

  updateFile(id: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    
    // Incluye el ID del archivo en la URL para que el servidor sepa cuál archivo actualizar
    return this.http.put(`${this.baseUrl}/files/update/${id}`, formData);
  }
  

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/files/download/${id}`, { responseType: 'blob' });
  }
}

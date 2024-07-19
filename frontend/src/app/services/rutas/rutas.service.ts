import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  constructor() { }
  getRole(): string {
    // Obtener el rol del usuario (de una cookie, local storage, o alguna otra forma)
    // Este es solo un ejemplo, ajústalo según tus necesidades
    return sessionStorage.getItem('role') || '';
  }
}
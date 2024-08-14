import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'b7d5$3Gf2LZ!4qH8Nc2@#fBv!0aP6xYl'; 

@Injectable({
  providedIn: 'root'  // Esto asegura que esté disponible en toda la aplicación
})

export class EncryptionServiceService {

 // Cifrar datos
 encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

// Descifrar datos
decrypt(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
}

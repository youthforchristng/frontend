import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

// import { environment } from 'src/environments/environment';
// import { SHA512, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  // secretKey;
  // s = "s 1111011110100111000011111111011100011110000010010101";

  open = environment.open;

  api= environment.api;



  constructor() { }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.open).toString();
  }

  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.open).toString(CryptoJS.enc.Utf8);
  }

  encryptR(data: string): string {

    const key = CryptoJS.enc.Utf8.parse(this.decrypt(this.api));
    // let k = "SingofTheLORDGOD"
    // const key = CryptoJS.enc.Utf8.parse(k);

    const encrypted = CryptoJS.AES.encrypt(data, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  };

  decryptR(data: string) {
    const ciphertext = data;

    const key = CryptoJS.enc.Utf8.parse(this.decrypt(this.api));
    // let k = "SingofTheLORDGOD"
    // const key = CryptoJS.enc.Utf8.parse(k);

    const decryptedBytes = CryptoJS.AES.decrypt(ciphertext, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    return CryptoJS.enc.Utf8.stringify(decryptedBytes);
  };


}

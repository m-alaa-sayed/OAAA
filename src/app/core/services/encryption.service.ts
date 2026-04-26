import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() {
  }

  public decryptData(encryptedData: string, decryptionKey: string): any {
    let s = CryptoJS.AES.decrypt(
      encryptedData, CryptoJS.enc.Utf8.parse(decryptionKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    ).toString(CryptoJS.enc.Utf8);

    return JSON.parse(s)
  }
}

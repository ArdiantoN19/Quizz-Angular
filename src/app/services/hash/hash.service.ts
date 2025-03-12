import { Injectable } from '@angular/core';
import CryptoJs from 'crypto-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class HashService {
  private secretKey: string = environment.auth.secretKey;

  hash(data: string): string {
    return CryptoJs.AES.encrypt(data, this.secretKey).toString();
  }

  decode(data: string): string {
    const bytes = CryptoJs.AES.decrypt(data, this.secretKey);
    return bytes.toString(CryptoJs.enc.Utf8);
  }

  compare(data: string, hashedData: string): boolean {
    const dataDecode = this.decode(hashedData);
    return data === dataDecode;
  }
}

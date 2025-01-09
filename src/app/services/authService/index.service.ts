import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TAuthCredential } from './index.type';
import { HashService } from '../hashService/index.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private hashService: HashService) {}
  isLoading: WritableSignal<boolean> = signal<boolean>(false)

  setAccountCredentialsLocalStorage(credential: TAuthCredential): void {
    credential.password = this.hashService.hash(credential.password);

    localStorage.setItem(
      environment.auth.accountCredentialLocalStorageKey,
      JSON.stringify(credential)
    );
  }

  getAccountCredentialLocalStorage(): TAuthCredential | null {
    const credential = localStorage.getItem(environment.auth.accountCredentialLocalStorageKey)
    return JSON.parse(credential!)
  }

  removeAccountCredentialLocalStorage(): void {
    localStorage.removeItem(environment.auth.accountCredentialLocalStorageKey);
  }
}

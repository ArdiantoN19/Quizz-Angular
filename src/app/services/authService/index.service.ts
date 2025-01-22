import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  ROLE,
  TAuthCredential,
  TRegisterCredential,
  TResponse,
  TUser,
} from './index.type';
import { HashService } from '../hashService/index.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { FirebaseService } from '../firebaseService/index.service';
import { TQueryExpression } from '../firebaseService/index.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private hashService: HashService,
    private firebaseService: FirebaseService
  ) {}

  setAccountCredentialsLocalStorage(credential: TAuthCredential): void {
    credential.password = this.hashService.hash(credential.password);

    localStorage.setItem(
      environment.auth.accountCredentialLocalStorageKey,
      JSON.stringify(credential)
    );
  }

  getAccountCredentialLocalStorage(): TAuthCredential | null {
    const credential = localStorage.getItem(
      environment.auth.accountCredentialLocalStorageKey
    );
    return JSON.parse(credential!);
  }

  removeAccountCredentialLocalStorage(): void {
    localStorage.removeItem(environment.auth.accountCredentialLocalStorageKey);
  }

  login(credential: TAuthCredential): Observable<TResponse<unknown>> {
    const expression: TQueryExpression = {
      fieldName: 'email',
      condition: '==',
      value: credential.email,
    };

    return this.firebaseService
      .getCollectionDataWithObservableByQuery<TUser>('users', expression)
      .pipe(
        switchMap((users: TUser[]) => {
          if (!users.length) {
            return of({
              status: 'fail',
              message: 'Please put your correct email!',
            });
          }

          const user = users[0];
          const comparePassword = this.hashService.compare(
            credential.password,
            user.password
          );
          if (!comparePassword) {
            return of({
              status: 'fail',
              message: 'Please put your correct password',
            });
          }

          return of({ status: 'success', message: 'Login successfully' });
        }),
        catchError((_err) => {
          return of({ status: 'fail', message: 'Error occured when login' });
        })
      );
  }

  async register(
    credential: TRegisterCredential
  ): Promise<TResponse<TUser | null>> {
    try {
      const queryExpression: TQueryExpression = {
        fieldName: 'email',
        condition: '==',
        value: credential.email,
      };

      const checkIfExistEmail: TUser[] =
        await this.firebaseService.getDocumentByQuery('users', queryExpression);
      if (checkIfExistEmail.length) {
        throw new Error('Email has been created!');
      }

      const payload: Omit<TUser, 'id'> = {
        ...credential,
        avatar: `${environment.avatar}=${credential.username}`,
        role: ROLE.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        password: this.hashService.hash(credential.password)
      };

      const data: TUser = await this.firebaseService.addDocument(payload, 'users');
      return { status: 'success', message: 'Register successfully', data };
    } catch (error: any) {
      return { status: 'fail', message: error.message, data: null };
    }
  }
}

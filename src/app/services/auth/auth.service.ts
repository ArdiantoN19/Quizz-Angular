import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  ROLE,
  TAuthCredential,
  TAuthState,
  TRegisterCredential,
  TUser,
} from './auth.type';
import { HashService } from '../hash/hash.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { TQueryExpression } from '../firebase/firebase.type';
import { ESTATUS, TResponse } from '../response.type';
import { ECOLLECTION } from '../../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly collectionName: ECOLLECTION = ECOLLECTION.USERS;

  constructor(
    private hashService: HashService,
    private firebaseService: FirebaseService,
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

  private setAuthState(authState: TAuthState) {
    const authStateHash = this.hashService.hash(JSON.stringify(authState));
    localStorage.setItem(
      environment.auth.authStateLocalStorageKey,
      authStateHash
    );
  }

  login(credential: TAuthCredential): Observable<TResponse<unknown>> {
    const expression: TQueryExpression[] = [
      {
        fieldName: 'email',
        condition: '==',
        value: credential.email,
      },
    ];

    return this.firebaseService
      .getCollectionDataWithObservableByQuery<TUser>(this.collectionName, expression)
      .pipe(
        switchMap((users: TUser[]) => {
          if (!users.length) {
            return of({
              status: ESTATUS.FAIL,
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
              status: ESTATUS.FAIL,
              message: 'Please put your correct password',
            });
          }

          const authState: TAuthState = {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            role: user.role,
            avatar: user.avatar,
            email: user.email,
            expired: Date.now() + environment.auth.expired,
          };

          this.setAuthState(authState);
          return of({ status: ESTATUS.SUCCESS, message: 'Login successfully' });
        }),
        catchError((_err) => {
          return of({ status: ESTATUS.FAIL, message: 'Error occured when login' });
        })
      );
  }

  async register(
    credential: TRegisterCredential
  ): Promise<TResponse<TUser | null>> {
    try {
      const queryExpressionEmail: TQueryExpression[] = [
        {
          fieldName: 'email',
          condition: '==',
          value: credential.email,
        },
      ];

      const checkIfExistEmail: TUser[] =
        await this.firebaseService.getDocumentByQuery(
          this.collectionName,
          queryExpressionEmail
        );
      if (checkIfExistEmail.length) {
        throw new Error('Email has been created!');
      }

      const queryExpressionUsername: TQueryExpression[] = [
        {
          fieldName: 'username',
          condition: '==',
          value: credential.username,
        },
      ];

      const checkIfExistUsername =
        await this.firebaseService.getDocumentByQuery(
          this.collectionName,
          queryExpressionUsername
        );

      if (checkIfExistUsername.length) {
        throw new Error('Username has been created!');
      }

      const payload: Omit<TUser, 'id'> = {
        ...credential,
        avatar: `${environment.avatar}=${credential.username}`,
        role: ROLE.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        password: this.hashService.hash(credential.password),
      };

      const data: TUser = await this.firebaseService.addDocument(
        payload,
        this.collectionName
      );
      return { status: ESTATUS.SUCCESS, message: 'Register successfully', data };
    } catch (error: any) {
      return { status: ESTATUS.FAIL, message: error.message, data: null };
    }
  }

  getAuthState(): TAuthState | null {
    const localAuthState = localStorage.getItem(environment.auth.authStateLocalStorageKey);
    if(!localAuthState) return null;

    const authStateDecode = this.hashService.decode(localAuthState)
    const authState: TAuthState = JSON.parse(authStateDecode)

    return authState
  }

  logout(): void {
    localStorage.removeItem(environment.auth.authStateLocalStorageKey)
  }
}

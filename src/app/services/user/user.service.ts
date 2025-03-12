import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { ROLE, TAuthState, TUser } from '../auth/auth.type';
import { AuthService } from '../auth/auth.service';
import { ESTATUS, TResponse } from '../response.type';
import { TPayloadUser } from './user.type';
import { environment } from '../../../environments/environment.development';
import { HashService } from '../hash/hash.service';
import { ECOLLECTION } from '../../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authState: TAuthState = {} as TAuthState;
  private readonly collectionName: ECOLLECTION = ECOLLECTION.USERS

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private hashService: HashService
  ) {
    const authState = authService.getAuthState();
    if (authState) {
      this.authState = authState;
    }
  }

  async getUsers(): Promise<TResponse<TUser[]>> {
    const users = await this.firebaseService.getDocumentByQuery<TUser>(
      this.collectionName,
      [
        {
          fieldName: 'email',
          condition: '!=',
          value: this.authState.email,
        },
      ]
    );

    let data = [...users];

    if(this.authState.role !== ROLE.SUPERADMIN) {
      data = data.filter(({role}) => role !== ROLE.SUPERADMIN);
    }

    data = data.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return {
      status: ESTATUS.SUCCESS,
      message: 'Success get list of users',
      data: data,
    };
  }

  async getUserById(id: string): Promise<TResponse<TUser>> {
    try {
      const user = await this.firebaseService.getDocumentByDocId<TUser>(
        this.collectionName,
        id
      );

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success get user',
        data: user,
      };
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
        message: error.message,
      };
    }
  }

  async addUser(payload: TPayloadUser): Promise<TResponse<TUser>> {
    try {
      const checkIfExistEmail =
        await this.firebaseService.getDocumentByQuery<TUser>(this.collectionName, [
          {
            fieldName: 'email',
            condition: '==',
            value: payload.email,
          },
        ]);

      if (checkIfExistEmail.length) {
        throw new Error('Failed when create user, email has been created!');
      }

      const checkIfExistUsername =
        await this.firebaseService.getDocumentByQuery<TUser>(this.collectionName, [
          {
            fieldName: 'username',
            condition: '==',
            value: payload.username,
          },
        ]);

      if (checkIfExistUsername.length) {
        throw new Error('Failed when create user, username has been created!');
      }

      const data: Omit<TUser, 'id'> = {
        ...payload,
        avatar: `${environment.avatar}=${payload.username}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        password: this.hashService.hash(payload.password),
      };
      const user = await this.firebaseService.addDocument<typeof data>(
        data,
        this.collectionName
      );

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success add user',
        data: user,
      };
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
        message: error.message,
      };
    }
  }

  async updateUserById(
    id: string,
    data: TPayloadUser
  ): Promise<TResponse<TUser>> {
    try {
      const user = await this.firebaseService.getDocumentByDocId<TUser>(
        this.collectionName,
        id
      );
      
      const payload = {
        ...data,
        password: this.hashService.hash(data.password),
        updatedAt: new Date().toISOString()
      }

      await this.firebaseService.updateDocumentByDocId(`users/${id}`, payload)

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success update user',
        data: {
          ...user,
          ...payload
        }
      }
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
        message: error.message ?? 'Error occured, please check your network',
      };
    }
  }

  async deleteUserById(id: string): Promise<TResponse<string>> {
    try {
      const user = await this.firebaseService.getDocumentByDocId<TUser>(
        this.collectionName,
        id
      );
      await this.firebaseService.deleteDocumentByDocId(this.collectionName, user.id);

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success deleted user',
        data: user.id,
      };
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
        message: error.message ?? 'Error occured, please check your network',
      };
    }
  }
}

import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebaseService/index.service';
import { ROLE, TAuthState, TUser } from '../authService/index.type';
import { AuthService } from '../authService/index.service';
import { TResponse } from '../index.type';
import { TPayloadUser } from './index.type';
import { environment } from '../../../environments/environment.development';
import { HashService } from '../hashService/index.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authState: TAuthState = {} as TAuthState;
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
      'users',
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
      status: 'success',
      message: 'Success get list of users',
      data: data,
    };
  }

  async getUserById(id: string): Promise<TResponse<TUser>> {
    try {
      const user = await this.firebaseService.getDocumentByDocId<TUser>(
        'users',
        id
      );

      return {
        status: 'success',
        message: 'Success get user',
        data: user,
      };
    } catch (error: any) {
      return {
        status: 'fail',
        message: error.message,
      };
    }
  }

  async addUser(payload: TPayloadUser): Promise<TResponse<TUser>> {
    try {
      const checkIfExistEmail =
        await this.firebaseService.getDocumentByQuery<TUser>('users', [
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
        await this.firebaseService.getDocumentByQuery<TUser>('users', [
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
        'users'
      );

      return {
        status: 'success',
        message: 'Success add user',
        data: user,
      };
    } catch (error: any) {
      return {
        status: 'fail',
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
        'users',
        id
      );
      
      const payload = {
        ...data,
        password: this.hashService.hash(data.password),
        updatedAt: new Date().toISOString()
      }

      await this.firebaseService.updateDocumentByDocId(`users/${id}`, payload)

      return {
        status: 'success',
        message: 'Success update user',
        data: {
          ...user,
          ...payload
        }
      }
    } catch (error: any) {
      return {
        status: 'fail',
        message: error.message ?? 'Error occured, please check your network',
      };
    }
  }

  async deleteUserById(id: string): Promise<TResponse<string>> {
    try {
      const user = await this.firebaseService.getDocumentByDocId<TUser>(
        'users',
        id
      );
      await this.firebaseService.deleteDocumentByDocId('users', user.id);

      return {
        status: 'success',
        message: 'Success deleted user',
        data: user.id,
      };
    } catch (error: any) {
      return {
        status: 'fail',
        message: error.message ?? 'Error occured, please check your network',
      };
    }
  }
}

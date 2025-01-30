import { Injectable } from "@angular/core";
import { FirebaseService } from "../firebaseService/index.service";
import { TAuthState, TResponse, TUser } from "../authService/index.type";
import { AuthService } from "../authService/index.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private authState: TAuthState = {} as TAuthState;
    constructor(private firebaseService: FirebaseService, private authService: AuthService) {
        const authState = authService.getAuthState();
        if(authState) {
            this.authState = authState
        } 
    }

    async getUsers(): Promise<TResponse<TUser[]>> {
        const users = await this.firebaseService.getDocumentByQuery<TUser>('users', [
            {
                fieldName: 'email',
                condition: '!=',
                value: this.authState.email
            }
        ])

        return {
            status: 'success',
            message: 'Success get list of users',
            data: users
        }
    }

    async deleteUserById(id: string): Promise<TResponse<string>> {
        try {
            const user = await this.firebaseService.getDocumentByDocId<TUser>('users', id);
            await this.firebaseService.deleteDocumentByDocId('users', user.id);

            return {
                status: 'success',
                message: 'Success deleted user',
                data: user.id
            }
        } catch (error: any) {
            return {
                status: 'fail',
                message: error.message
            }
        }
    }
}
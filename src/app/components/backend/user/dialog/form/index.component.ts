import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { patternPassword } from '../../../../../utils';
import { ROLE, TUser } from '../../../../../services/authService/index.type';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorCustomMessageService } from '../../../../../utils/errorCustomMessage.service';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../../../services/userService/index.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserPageApp } from '../../../../../pages/backend/user/index.component';
import { HashService } from '../../../../../services/hashService/index.service';
import { TResponse } from '../../../../../services/index.type';

export type TDataDialog = {
  mode: 'new' | 'edit';
  data: TUser | null;
};

type TFormName = 'username' | 'email' | 'fullname' | 'password' | 'role';

@Component({
  selector: 'dialog-form-user-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
  ],
})
export class DialogFormUserAppComponent implements OnInit {
  data = inject<TDataDialog>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<UserPageApp>);
  private errorMessageService = inject(ErrorCustomMessageService);
  private userService = inject(UserService);
  private snackbar = inject(MatSnackBar);
  private hashService = inject(HashService);

  protected defaultPassword: string = 'Password123.';
  roles: string[] = Object.keys(ROLE);
  isShowPassword: boolean = false;

  userForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.email, Validators.required]),
    fullname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl(this.defaultPassword, [
      Validators.required,
      Validators.pattern(patternPassword),
    ]),
    role: new FormControl<string>(ROLE.USER, [Validators.required]),
  });

  ngOnInit(): void {
    if (this.data.data && this.data.mode === 'edit') {
      const { username, email, fullname, password, role } = this.data.data;
      this.userForm.setValue({
        username,
        email,
        fullname,
        password: this.hashService.decode(password),
        role,
      });
    }
  }

  getErrorMessage(name: TFormName): string {
    return this.errorMessageService.getMessage(
      this.userForm.get(name) as any,
      name
    );
  }

  onShowPasswordHandler(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  async onSubmitHandler() {
    if (this.userForm.valid) {
      const payload = {
        username: this.userForm.value.username!,
        email: this.userForm.value.email!,
        password: this.userForm.value.password!,
        fullname: this.userForm.value.fullname!,
        role: this.userForm.value.role!,
      };

      let response: TResponse<TUser> = {} as TResponse<TUser>;

      if(this.data.mode === 'new') {
        response = await this.userService.addUser(payload);
      } else {
        response = await this.userService.updateUserById(this.data.data?.id!, payload)
      }
      
      if (response.status === 'success') {
        this.dialogRef.close(response);
      }
      this.snackbar.open(response.message, 'close');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ErrorCustomMessageService } from '../../../utils/errorCustomMessage.service';
import { patternPassword } from '../../../utils';
import { Location } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../services/authService/index.service';
import { HashService } from '../../../services/hashService/index.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'login-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    RouterLink
  ],
})
export class LoginAppComponent implements OnInit {
  constructor(
    private errorCustomMessageService: ErrorCustomMessageService,
    private location: Location,
    private authService: AuthService,
    private hashService: HashService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(patternPassword),
    ]),
    rememberMe: new FormControl<boolean>(false),
  });

  ngOnInit(): void {
    const accountCredential =
      this.authService.getAccountCredentialLocalStorage();
    if (accountCredential) {
      accountCredential.password = this.hashService.decode(
        accountCredential.password
      );

      const checkIfExistValue = Object.values(accountCredential).every(
        ([email, password]) => email && password
      );
      if (checkIfExistValue) {
        this.loginForm.setValue({
          email: accountCredential.email,
          password: accountCredential.password,
          rememberMe: true,
        });
      }
    }
  }

  goBackHandler() {
    this.location.back();
  }

  getErrorMessage(name: 'email' | 'password') {
    const formControl = this.loginForm.get(name);
    return this.errorCustomMessageService.getMessage(formControl as any, name);
  }

  onSubmitHandler(): void {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      
      if (!!rememberMe) {
        const data = {
          email: email!,
          password: password!,
        };
        this.authService.setAccountCredentialsLocalStorage(data);
      } else {
          this.authService.removeAccountCredentialLocalStorage();
      }

      console.log(this.loginForm.value)
    }
  }
}

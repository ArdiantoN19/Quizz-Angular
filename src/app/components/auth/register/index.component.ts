import { Component } from '@angular/core';
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
import { AuthService } from '../../../services/authService/index.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'register-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
  ],
})
export class RegisterAppComponent {
  isLoading: boolean = false;
  isShowPassword: boolean = false;

  constructor(
    private errorCustomMessageService: ErrorCustomMessageService,
    private location: Location,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  registerForm = new FormGroup({
    fullname: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    username: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(patternPassword),
    ]),
  });

  goBackHandler() {
    this.location.back();
  }

  onShowPasswordHandler() {
    this.isShowPassword = !this.isShowPassword
  }

  getErrorMessage(name: 'email' | 'password' | 'fullname' | 'username') {
    const formControl = this.registerForm.get(name);
    return this.errorCustomMessageService.getMessage(formControl as any, name);
  }

 async onSubmitHandler(): Promise<void> {
    if (this.registerForm.valid) {
      const {fullname, username, email, password} = this.registerForm.value
      if(fullname && username && email && password) {
        this.isLoading = true;

        const response = await this.authService.register({fullname, username, email, password})
        const snackRef = this.snackbar.open(response.message, 'close')

        if(response.status === 'success') {
           this.router.navigate([`/login`], {
            queryParams: {
              'redirectUrl': encodeURIComponent('/home')
            }
          })
        }

        snackRef.afterOpened().subscribe(() => {
          this.isLoading = false;
        })
      }
    }
  }
}

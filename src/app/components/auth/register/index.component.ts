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
import { RouterLink } from '@angular/router';

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
  constructor(
    private errorCustomMessageService: ErrorCustomMessageService,
    private location: Location,
    private authService: AuthService,
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

  getErrorMessage(name: 'email' | 'password' | 'fullname' | 'username') {
    const formControl = this.registerForm.get(name);
    return this.errorCustomMessageService.getMessage(formControl as any, name);
  }

  onSubmitHandler(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value)
    }
  }
}

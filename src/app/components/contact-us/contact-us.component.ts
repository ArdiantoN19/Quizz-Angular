import { NgOptimizedImage } from '@angular/common';
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
import { ErrorCustomMessageService } from '../../services/error-custom-message/error-custom-message.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'contact-us-app',
  templateUrl: 'contact-us.component.html',
  styleUrl: 'contact-us.component.scss',
  imports: [
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
})
export class ContactUsAppComponent {
  constructor(private errorCustomMessageService: ErrorCustomMessageService) {}

  contactForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    message: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  getErrorMessage(name: 'name' | 'email' | 'message') {
    return this.errorCustomMessageService.getMessage(this.contactForm.get(name) as any, name)
  }

  onSubmitHandler() {
    const checkValidInput = Object.values(this.contactForm.value).some((value) => value && value !== undefined)
    if(!checkValidInput) {
      console.log('not valid input')
      return;
    }

    console.log(this.contactForm.value)
    this.contactForm.setValue({
      name: 'Ex.John Doe',
      email: 'Ex.johndoe@gmail.com',
      message: 'Ex.Your message'
    })
  }
}

import { Component, HostListener, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatStepperModule,
  StepperOrientation,
} from '@angular/material/stepper';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'quiz-stepper-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class QuizStepperAppComponent {
  private maxWidthMobile: number = 500;

  stepperOrientation: StepperOrientation = 'horizontal' as StepperOrientation;

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor() {
    this.checkMobileMode();

    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.checkMobileMode());
  }

  @HostListener('window:resize', [])
  private checkMobileMode(): void {
    const isMobileMode = window.innerWidth < this.maxWidthMobile;
    this.stepperOrientation = !isMobileMode ? 'horizontal' : 'vertical';
  }
}

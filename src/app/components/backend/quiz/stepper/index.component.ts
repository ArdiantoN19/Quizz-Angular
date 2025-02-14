import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatStepperModule,
  StepperOrientation,
  MatStepper,
} from '@angular/material/stepper';
import { debounceTime, fromEvent } from 'rxjs';
import { QuizFormAppComponent, TPayloadEmit } from './formQuiz/index.component';
import { TPayloadQuiz } from '../../../../services/quizService/index.type';

type TPayloadEmitFormQuiz = TPayloadEmit;

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
    QuizFormAppComponent,
  ],
})
export class QuizStepperAppComponent {
  private maxWidthMobile: number = 500;
  private formQuizData!: TPayloadQuiz;
  private _formBuilder = inject(FormBuilder);

  stepperOrientation: StepperOrientation = 'horizontal' as StepperOrientation;

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  @ViewChild('stepper') private stepper!: MatStepper;

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

  onHandleQuizSubmitForm(data: TPayloadEmitFormQuiz) {
    const { title, description, timer, categoryId, difficultyId, typeQuizId, thumbnail, isNext, totalQuestion } = data;
    const formData = {
      title, description,  timer, categoryId, difficultyId, typeQuizId, thumbnail
    }
    this.formQuizData = formData;

    if(isNext) {
      this.stepper.next()
      console.log(this.formQuizData)
    }
  }
}

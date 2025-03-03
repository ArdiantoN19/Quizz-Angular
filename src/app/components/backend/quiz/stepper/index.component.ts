import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatStepperModule,
  StepperOrientation,
  MatStepper,
} from '@angular/material/stepper';
import { debounceTime, fromEvent } from 'rxjs';
import { QuizFormAppComponent } from './formQuiz/index.component';
import {
  TPayloadQuestion,
  TPayloadQuestionStepper,
  TPayloadQuiz,
  TPayloadQuizAdd,
  TPayloadQuizStepper,
} from '../../../../services/quizService/index.type';
import { QuestionQuizFormAppComponent } from './formQuestion/index.component';
import { TYPEQUIZENUM } from '../../../../utils/constant';
import { QuizService } from '../../../../services/quizService/index.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogResetQuizAppComponent } from './dialogResetQuiz/index.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

type TPayloadEmitFormQuiz = TPayloadQuizStepper;
type TPayloadEmitFormQuestion = TPayloadQuestion;

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
    QuestionQuizFormAppComponent,
    MatIconModule,
    MatDividerModule,
    MatTooltip,
  ],
})
export class QuizStepperAppComponent implements AfterViewInit {
  private maxWidthMobile: number = 500;
  private changeDetectorRef = inject(ChangeDetectorRef);
  private quizService = inject(QuizService);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar)
  private router = inject(Router)

  formQuizData: TPayloadQuiz | null = null;
  formQuestionData: TPayloadQuestion[] | null = null;
  protected totalQuestion: number = 0;
  protected typeQuiz: TYPEQUIZENUM = TYPEQUIZENUM.MULTIPLE_CHOICE;

  stepperOrientation: StepperOrientation = 'horizontal' as StepperOrientation;

  @ViewChild('stepper') private stepper!: MatStepper;

  constructor() {
    this.checkMobileMode();

    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.checkMobileMode());
  }

  ngAfterViewInit(): void {
    const stepOne = this.stepper.steps.toArray()[0];
    const stepTwo = this.stepper.steps.toArray()[1];

    const quizData =
      this.quizService.getSetupQuizFromLocalStorage<TPayloadQuizStepper>(0);
    const questionData =
      this.quizService.getSetupQuizFromLocalStorage<TPayloadQuestionStepper[]>(
        1
      );

    if (quizData) {
      const {
        title,
        description,
        timer,
        categoryId,
        difficultyId,
        typeQuizId,
        thumbnail,
        totalQuestion,
        typeQuiz,
      } = quizData;

      this.formQuizData = {
        title,
        description,
        timer,
        categoryId,
        difficultyId,
        typeQuizId,
        thumbnail,
      };

      this.totalQuestion = totalQuestion;
      this.typeQuiz = typeQuiz;

      stepOne.completed = true;
      this.stepper.selectedIndex = 1;
    }

    if (quizData && questionData) {
      this.formQuestionData = questionData;
      stepTwo.completed = true;
      this.stepper.selectedIndex = 2;
    }
    this.formQuestionData = questionData;
  }

  @HostListener('window:resize', [])
  private checkMobileMode(): void {
    const isMobileMode = window.innerWidth < this.maxWidthMobile;
    this.stepperOrientation = !isMobileMode ? 'horizontal' : 'vertical';
  }

  onQuizSubmitFormHandler(data: TPayloadEmitFormQuiz) {
    const {
      title,
      description,
      timer,
      categoryId,
      difficultyId,
      typeQuizId,
      thumbnail,
      totalQuestion,
      typeQuiz,
    } = data;
    const formData = {
      title,
      description,
      timer,
      categoryId,
      difficultyId,
      typeQuizId,
      thumbnail,
    };
    this.formQuizData = formData;
    this.totalQuestion = totalQuestion;
    this.typeQuiz = typeQuiz;

    this.quizService.saveSetupQuizToLocalStorage(data);

    this.changeDetectorRef.detectChanges();
    this.stepper.next();
  }

  onQuestionSubmitFormHandler(data: TPayloadEmitFormQuestion[]) {
    this.formQuestionData = data;
    this.quizService.saveSetupQuizToLocalStorage(data);

    this.changeDetectorRef.detectChanges();
    this.stepper.next();
  }

  onResetSetupQuizHandler() {
    const dialogRef = this.dialog.open(DialogResetQuizAppComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.quizService.removeSetupQuizFromLocalStorage();
        this.totalQuestion = 0;
        this.typeQuiz = TYPEQUIZENUM.MULTIPLE_CHOICE;

        this.formQuizData = null;
        this.formQuestionData = null;

        this.stepper.reset();
      }
    });
  }

  async onSubmitHandler() {
    if (this.formQuizData && this.formQuestionData) {
      const payload: TPayloadQuizAdd = {
        quiz: this.formQuizData,
        questions: this.formQuestionData,
      };

      const response = await this.quizService.addQuiz(payload);

      this.quizService.removeSetupQuizFromLocalStorage();
      this.snackbar.open(response.message, 'close')
      this.router.navigate(['/admin/quiz'])
    }
  }
}

import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorCustomMessageService } from '../../../../../utils/errorCustomMessage.service';
import { TYPEQUIZENUM } from '../../../../../utils/constant';
import { MatStepper } from '@angular/material/stepper';

// questions: [
//     {
//         question: 'what is angular?',
//         answers: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
//          isCorrect: 0
//     }
// ]

type TQuestion = {
  question: string;
  answers: string[];
  isCorrect: number;
};

@Component({
  selector: 'question-quiz-form-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatRadioModule,
  ],
})
export class QuestionQuizFormAppComponent implements OnChanges {
  @Input({ required: true }) totalQuestion!: number;
  @Input({ required: true }) typeQuiz!: TYPEQUIZENUM;
  @Input({ required: true }) stepper!: MatStepper;

  private formBuilder = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);
  private errorMessageService = inject(ErrorCustomMessageService);

  questionForm: FormGroup;
  typeQuizOption: string[] = Object.values(TYPEQUIZENUM);

  constructor() {
    this.questionForm = this.formBuilder.group({
      questions: this.formBuilder.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newTotalQuestion = changes['totalQuestion'];
    const newTypeQuiz = changes['typeQuiz'];
    
    if(newTotalQuestion) {
      this.totalQuestion = newTotalQuestion.currentValue;
    }

    if(newTypeQuiz) {
      this.typeQuiz = newTypeQuiz.currentValue;
    }

    this.generateQuestion();
  }

  get formArrayQuestion(): FormArray {
    return this.questionForm.get('questions') as FormArray;
  }

  formArrayAnswer(index: number): FormArray {
    return this.formArrayQuestion.at(index).get('answers') as FormArray;
  }

  get lastQuestionIndex(): number {
    return this.formArrayQuestion.controls.length - 1;
  }

  getQuestionNumber(index: number): number {
    return index + 1;
  }

  getErrorMessage(
    name: 'question' | 'answer',
    indexQuestion: number,
    indexAnswer?: number
  ): string {
    if (name === 'answer' && indexAnswer) {
      return this.errorMessageService.getMessage(
        this.formArrayAnswer(indexQuestion).at(indexAnswer) as any,
        `${name} ${indexAnswer + 1}`
      );
    }

    return this.errorMessageService.getMessage(
      this.formArrayQuestion.at(indexQuestion).get('question') as any,
      name
    );
  }

  /**
   *
   * @param typeQuiz TYPEQUIZENUM
   * @param lengthOption optional parameter for multiple choice
   * @returns
   */
  private createAnswers(
    typeQuiz: TYPEQUIZENUM,
    lengthOption: number = 4
  ): FormArray {
    const formAnswers = this.formBuilder.array([]) as FormArray;

    // for multiple quiz
    if (typeQuiz === TYPEQUIZENUM.MULTIPLE_CHOICE) {
      const multipleChoice: any[] = Array(lengthOption).fill(null);
      multipleChoice.forEach(() => {
        formAnswers.push(
          this.formBuilder.control('', [
            Validators.required,
            Validators.minLength(3),
          ])
        );
      });
    } else {
      const trueOrFalseChoice: any[] = Array(2).fill(null);
      trueOrFalseChoice.forEach((_, index) => {
        formAnswers.push(this.formBuilder.control(index > 0 ? false : true));
      });
    }

    return formAnswers;
  }

  private createQuestion(typeQuiz: TYPEQUIZENUM): FormGroup {
    return this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(5)]],
      answers: this.createAnswers(typeQuiz),
      isCorrect: [0, Validators.required],
    });
  }

  private addQuestion(typeQuiz: TYPEQUIZENUM) {
    const createQuestion = this.createQuestion(typeQuiz);
    this.formArrayQuestion.push(createQuestion);
  }

  private generateQuestion() {
    this.questionForm = this.formBuilder.group({
      questions: this.formBuilder.array([])
    })

    Array(this.totalQuestion)
      .fill(null)
      .forEach(() => this.addQuestion(this.typeQuiz));
  }

  onAddQuestionHandler(typeQuiz: TYPEQUIZENUM) {
    this.addQuestion(typeQuiz);
  }

  onDeleteQuestionHandler(index: number) {
    const values: TQuestion[] = this.questionForm.value.questions;

    if (values.length === 1) {
      this.snackbar.open('You must have at least 1 question!', 'close');
      return;
    }

    const questions = values
      .slice(0, index)
      .concat(values.slice(index + 1))
      .concat(values[index]);

    this.questionForm.setValue({
      questions,
    });
    this.formArrayQuestion.removeAt(values.length - 1);
  }

  onSubmitHandler() {
    console.log(this.questionForm.value);
  }
}

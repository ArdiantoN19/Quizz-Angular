import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../../../services/categoryService/index.service';
import { DifficultyService } from '../../../../../services/difficultyService/index.service';
import { TypeQuizService } from '../../../../../services/typeQuizService/index.service';
import { SkeletonAppComponent } from '../../../../skeleton/index.component';
import { ErrorCustomMessageService } from '../../../../../utils/errorCustomMessage.service';
import { TPayloadQuiz } from '../../../../../services/quizService/index.type';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

type TOption = {
  name: string;
  value: string;
};

type TErrorName =
  | 'title'
  | 'description'
  | 'timer'
  | 'categoryId'
  | 'difficultyId'
  | 'typeQuizId'
  | 'totalQuestion'
  | 'thumbnail';

export type TPayloadEmit = {
  totalQuestion: number;
} & TPayloadQuiz;

type TThumbnail = {
  src: string;
  name: string;
  error?: string;
};

const MAX_THUMBNAIL_SIZE: number = 3000000;
const typeImages: string[] = [
  'image/webp',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

@Component({
  selector: 'quiz-form-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    SkeletonAppComponent,
    MatTooltipModule,
  ],
})
export class QuizFormAppComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private difficultyService = inject(DifficultyService);
  private typeQuizService = inject(TypeQuizService);
  private errorService = inject(ErrorCustomMessageService);
  private snackbar = inject(MatSnackBar);

  @Output() eventSubmitForm = new EventEmitter<any>();

  @ViewChild('thumbnailInput') thumbnailInput!: ElementRef<HTMLInputElement>;

  quizForm = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(500),
    ]),
    timer: new FormControl<number>(0, [
      Validators.required,
      Validators.min(10),
    ]),
    categoryId: new FormControl<string>('', [Validators.required]),
    difficultyId: new FormControl<string>('', [Validators.required]),
    typeQuizId: new FormControl<string>('', [Validators.required]),
    totalQuestion: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(300)
    ]),
    thumbnail: new FormControl('', [Validators.required]),
  });

  categoryOptions: TOption[] = [];
  difficultOptions: TOption[] = [];
  typeQuizOptions: TOption[] = [];
  isLoading: boolean = true;
  thumbnail: TThumbnail | null = null;

  isSaveClickedTime: WritableSignal<number> = signal(0);

  ngOnInit(): void {
    (async () => {
      this.categoryService.getCategories().subscribe((result) => {
        if (result.data && result.status === 'success') {
          this.categoryOptions = result.data.map(({ id, name }) => ({
            name,
            value: id,
          }));
        }
      });

      const [difficultData, typeQuizData] = await Promise.all([
        this.difficultyService.getDifficulities(),
        this.typeQuizService.getTypeQuiz(),
      ]);
      if (
        difficultData.status === 'success' &&
        typeQuizData.status === 'success'
      ) {
        if (difficultData.data) {
          this.difficultOptions = difficultData.data.map(({ id, name }) => ({
            name,
            value: id,
          }));
        }

        if (typeQuizData.data) {
          this.typeQuizOptions = typeQuizData.data.map(({ id, name }) => ({
            name,
            value: id,
          }));
        }

        this.isLoading = false;
      }
    })();
  }

  getErrorMessage(name: TErrorName): string {
    const control = this.quizForm.get(name) as any;

    const transformName: Record<string, string> = {
      categoryId: 'category',
      difficultyId: 'difficulty',
      typeQuizId: 'type quiz',
      totalQuestion: 'total question',
    };

    return this.errorService.getMessage(
      control,
      Object.keys(transformName).includes(name) ? transformName[name] : name
    );
  }

  onResetThumbnailHandler(): void {
    this.thumbnail = {
      src: '',
      name: '',
      error: 'Thumbnail is required',
    } as TThumbnail;

    if (this.thumbnailInput) {
      this.thumbnailInput.nativeElement.value = '';
    }
  }

  onChangeThumbnailHandler(event: any) {
    const file: File = event.target.files[0];

    if (file.size > MAX_THUMBNAIL_SIZE) {
      this.snackbar.open('Large size, please put correct size file', 'close');

      this.onResetThumbnailHandler();
    } else if (!typeImages.includes(file.type)) {
      this.snackbar.open(
        'Not supported type, please put corret type file',
        'close'
      );

      this.onResetThumbnailHandler();
    } else {
      const src = URL.createObjectURL(file);

      this.thumbnail = {
        src,
        name: file.name,
      };

      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.quizForm.patchValue({
          thumbnail: fileReader.result as string,
        });
      };

      fileReader.readAsDataURL(file);
    }
  }

  onSubmitHandler() {
    const thumbnailError = this.quizForm.get('thumbnail')?.hasError('required');

    if (thumbnailError) {
      this.thumbnail = {
        ...this.thumbnail,
        error: 'Thumbnail is required',
      } as TThumbnail;
    }
    
    if (this.quizForm.valid) {
      this.isSaveClickedTime.update((clicked) => clicked+=1);
      this.eventSubmitForm.emit(this.quizForm.value);
    }
  }
}

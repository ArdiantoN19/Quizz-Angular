import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebaseService/index.service';
import { TQueryExpression } from '../firebaseService/index.type';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { TResponse } from '../index.type';
import {
  TDifficulty,
  TPayloadQuestionStepper,
  TPayloadQuiz,
  TPayloadQuizStepper,
  TQuiz,
  TQuizTransform,
  TTypeQuiz,
} from './index.type';
import { TUser } from '../authService/index.type';
import { TCategory } from '../categoryService/index.type';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private keyStepperQuiz: string;

  constructor(private firebaseService: FirebaseService) {
    this.keyStepperQuiz = environment.stepperQuizLocalStorageKey;
  }

  private async getUsers(): Promise<TUser[]> {
    const queryExpressionUser: TQueryExpression[] = [
      {
        fieldName: 'email',
        condition: '!=',
        value: '',
      },
    ];

    const users = await this.firebaseService.getDocumentByQuery<TUser>(
      'users',
      queryExpressionUser
    );

    return users;
  }

  private async getData<T>(
    collectionName: 'categories' | 'difficulities' | 'typeQuiz'
  ): Promise<T[]> {
    const queryExpressionData: TQueryExpression[] = [
      {
        fieldName: 'name',
        condition: '!=',
        value: '',
      },
    ];

    const datas = await this.firebaseService.getDocumentByQuery<T>(
      collectionName,
      queryExpressionData
    );

    return datas;
  }

  async getQuiz(): Promise<Observable<TResponse<TQuizTransform[]>>> {
    const users = await this.getUsers();
    const categories = await this.getData<TCategory>('categories');
    const difficulities = await this.getData<TDifficulty>('difficulities');
    const typeQuiz = await this.getData<TTypeQuiz>('typeQuiz');

    const queryExpressionQuiz: TQueryExpression[] = [
      {
        fieldName: 'slug',
        condition: '!=',
        value: '',
      },
    ];

    const getDataTransform = (
      name: 'category' | 'difficulty' | 'typeQuiz',
      id: string
    ): TQuizTransform['category'] => {
      const data = {
        category: categories.find((category) => category.id === id),
        difficulty: difficulities.find((difficulty) => difficulty.id === id),
        typeQuiz: typeQuiz.find((typeQuizItem) => typeQuizItem.id === id),
      };

      const result: TQuizTransform['category'] | undefined = data[name];

      return {
        id,
        name: result?.name ?? 'N/A',
        slug: result?.slug ?? 'N/A',
      };
    };

    return this.firebaseService
      .getCollectionDataWithObservableByQuery<TQuiz>(
        'quiz',
        queryExpressionQuiz
      )
      .pipe(
        switchMap((quiz: TQuiz[]) => {
          const data: TQuizTransform[] = quiz.map((item: TQuiz) => ({
            id: item.id,
            category: getDataTransform('category', item.categoryId),
            typeQuiz: getDataTransform('typeQuiz', item.typeQuizId),
            difficulty: getDataTransform('difficulty', item.difficultyId),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            description: item.description,
            isPublished: item.isPublished,
            slug: item.slug,
            thumbnail: item.thumbnail,
            timer: item.timer,
            title: item.title,
            user: {
              id: item.createdBy,
              fullname:
                users.find((user) => user.id === item.createdBy)?.fullname ??
                'Quiz Admin',
            },
            totalQuestion: 25,
          }));

          return of({
            status: 'success',
            message: 'Success get quiz',
            data,
          });
        }),
        catchError((_err) => {
          return of({
            status: 'fail',
            message: 'Error occured when get data quiz',
          });
        })
      );
  }

  async updatePublishQuiz(id: string): Promise<TResponse<string>> {
    try {
      const quiz = await this.firebaseService.getDocumentByDocId<TQuiz>(
        'quiz',
        id
      );

      await this.firebaseService.updateDocumentByDocId<{
        isPublished: boolean;
      }>(`quiz/${quiz.id}`, {
        isPublished: !quiz.isPublished,
      });

      return {
        status: 'success',
        message: `Success ${
          !quiz.isPublished ? 'published' : 'unpublished'
        } quiz`,
        data: id,
      };
    } catch (error: any) {
      return {
        status: 'fail',
        message: error.message,
      };
    }
  }

  getSetupQuizFromLocalStorage<T>(stepIndex: number): T | null {
    const quiz = localStorage.getItem(this.keyStepperQuiz);
    if (!quiz) return null;

    const parseQuiz = JSON.parse(quiz);
    return parseQuiz[stepIndex] as T;
  }

  saveSetupQuizToLocalStorage(
    data: TPayloadQuizStepper | TPayloadQuestionStepper[]
  ): void {
    const isExistQuiz = this.getSetupQuizFromLocalStorage<TPayloadQuizStepper>(0);
    let storeData: any = [];

    if (!isExistQuiz) {
      storeData = [data, null];
    } else {
      storeData = [isExistQuiz, data];
    }

    localStorage.setItem(this.keyStepperQuiz, JSON.stringify(storeData));
  }

  removeSetupQuizFromLocalStorage(): void {
    localStorage.removeItem(this.keyStepperQuiz)
  }
}

import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebaseService/index.service';
import { TQueryExpression } from '../firebaseService/index.type';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { TResponse } from '../index.type';
import { TDifficulty, TQuiz, TQuizTransform, TTypeQuiz } from './index.type';
import { TUser } from '../authService/index.type';
import { TCategory } from '../categoryService/index.type';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private firebaseService: FirebaseService) {}

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

    const getDataTransform = (name: 'category' | 'difficulty' | 'typeQuiz', id: string): TQuizTransform['category'] => {

        const data = {
            'category': categories.find((category) => category.id === id),
            'difficulty': difficulities.find((difficulty) => difficulty.id === id),
            'typeQuiz': typeQuiz.find((typeQuizItem) => typeQuizItem.id === id),
        }

        const result: TQuizTransform['category'] | undefined = data[name];

        return {
            id,
            name: result?.name ?? 'N/A',
            slug: result?.slug ?? 'N/A',
        }
    }


    return this.firebaseService
      .getCollectionDataWithObservableByQuery<TQuiz>('quiz', queryExpressionQuiz)
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
                fullname: users.find((user) => user.id === item.createdBy)?.fullname ?? 'Quiz Admin'
            },
            totalQuestion: 25
          }))

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
}

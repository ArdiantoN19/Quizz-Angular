import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebaseService/index.service';
import { TQueryExpression } from '../firebaseService/index.type';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { TResponse } from '../index.type';
import {
  TAddQuizResponse,
  TDifficulty,
  TPayloadQuestionStepper,
  TPayloadQuizAdd,
  TPayloadQuizStepper,
  TQuiz,
  TQuizTransform,
  TTypeQuiz,
} from './index.type';
import { TAuthState, TUser } from '../authService/index.type';
import { TCategory } from '../categoryService/index.type';
import { environment } from '../../../environments/environment.development';
import { ENUMCOLLECTION } from '../../utils/constant';
import { formatSlug } from '../../utils';
import { AuthService } from '../authService/index.service';
import {
  TAddQuestionResponse,
  TPayloadQuestionAdd,
} from '../questionService/index.type';
import { QuestionService } from '../questionService/index.service';
import { AnswerService } from '../answerService/index.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly keyStepperQuiz: string =
    environment.stepperQuizLocalStorageKey;
  private readonly collectionName: ENUMCOLLECTION = ENUMCOLLECTION.QUIZ;
  private authState = {} as TAuthState;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private questionService: QuestionService,
    private answerService: AnswerService
  ) {
    const authState = authService.getAuthState();
    if (authState) {
      this.authState = authState;
    }
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
      ENUMCOLLECTION.USERS,
      queryExpressionUser
    );

    return users;
  }

  private async getData<T>(
    collectionName:
      | ENUMCOLLECTION.CATEGORIES
      | ENUMCOLLECTION.DIFFICULITIES
      | ENUMCOLLECTION.TYPE_QUIZ
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
    const categories = await this.getData<TCategory>(ENUMCOLLECTION.CATEGORIES);
    const difficulities = await this.getData<TDifficulty>(
      ENUMCOLLECTION.DIFFICULITIES
    );
    const typeQuiz = await this.getData<TTypeQuiz>(ENUMCOLLECTION.TYPE_QUIZ);

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

    const totalQuestions = await this.questionService.getTotalQuestions();

    return this.firebaseService
      .getCollectionDataWithObservableByQuery<TQuiz>(
        this.collectionName,
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
            totalQuestion: totalQuestions.data?.length
              ? totalQuestions.data.find(({ quizId }) => quizId === item.id)
                  ?.totalQuestion ?? 0
              : 0,
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
        this.collectionName,
        id
      );

      await this.firebaseService.updateDocumentByDocId<{
        isPublished: boolean;
      }>(`${this.collectionName}/${quiz.id}`, {
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

  async addQuiz(
    payload: TPayloadQuizAdd
  ): Promise<TResponse<TAddQuizResponse>> {
    try {
      const payloadQuiz: Omit<TQuiz, 'id'> = {
        ...payload.quiz,
        isPublished: false,
        slug: formatSlug(payload.quiz.title),
        createdBy: this.authState.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const quiz = await this.firebaseService.addDocument<typeof payloadQuiz>(
        payloadQuiz,
        this.collectionName
      );

      const payloadQuestions: TPayloadQuestionAdd[] = payload.questions.map(
        ({ question, answers, isCorrect }) => ({
          question,
          quizId: quiz.id,
          answers,
          isCorrect,
        })
      );

      const resQuestion = await this.questionService.addQuestionsWithAnswers(
        payloadQuestions
      );

      if (resQuestion.status === 'fail') {
        throw new Error(resQuestion.message);
      }

      let questions: Omit<TAddQuestionResponse, 'quizId'>[] = [];

      if (resQuestion.data) {
        questions = resQuestion.data.map((questionData) => ({
          id: questionData.id,
          answers: questionData.answers,
          isCorrect: questionData.isCorrect,
          question: questionData.question,
        }));
      }

      const results: TAddQuizResponse = { ...quiz, questions };

      return {
        status: 'success',
        message: 'Success add quiz',
        data: results,
      };
    } catch (error) {
      return {
        status: 'fail',
        message: 'Failed add quiz',
      };
    }
  }

  async deleteQuizById(quizId: string): Promise<TResponse<any>> {
    try {
      const quiz = await this.firebaseService.getDocumentByDocId<TQuiz>(
        this.collectionName,
        quizId
      );

      await this.firebaseService.deleteDocumentByDocId(
        this.collectionName,
        quiz.id
      );

      const deleteQuestionResponse = await this.questionService.deleteQuestionByQuizId(quiz.id);
      if(deleteQuestionResponse.status === 'fail') {
        throw new Error(deleteQuestionResponse.message);
      }

      const deleteAnswerResponse = await this.answerService.deleteAnswerByQuestionIds(deleteQuestionResponse.data);
      if(deleteAnswerResponse.status === 'fail') {
        throw new Error(deleteAnswerResponse.message);
      }

      return {
        status: 'success',
        message: 'Success deleted quiz',
        data: quiz.id
      };
    } catch (error: any) {
      return {
        status: 'fail',
        message: error.message ?? 'Failed delete quiz',
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
    const isExistQuiz =
      this.getSetupQuizFromLocalStorage<TPayloadQuizStepper>(0);
    let storeData: any = [];

    if (!isExistQuiz) {
      storeData = [data, null];
    } else {
      storeData = [isExistQuiz, data];
    }

    localStorage.setItem(this.keyStepperQuiz, JSON.stringify(storeData));
  }

  removeSetupQuizFromLocalStorage(): void {
    localStorage.removeItem(this.keyStepperQuiz);
  }
}

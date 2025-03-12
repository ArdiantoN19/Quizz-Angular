import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { TQueryExpression } from '../firebase/firebase.type';
import { catchError, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { ESTATUS, TResponse } from '../response.type';
import {
  TAddQuizResponse,
  TDifficulty,
  TPayloadQuestionStepper,
  TPayloadQuizAdd,
  TPayloadQuizStepper,
  TQuiz,
  TQuizTransform,
  TTypeQuiz,
} from './quiz.type';
import { TAuthState, TUser } from '../auth/auth.type';
import { TCategory } from '../category/category.type';
import { environment } from '../../../environments/environment.development';
import { ECOLLECTION } from '../../utils/constant';
import { formatSlug } from '../../utils';
import { AuthService } from '../auth/auth.service';
import {
  TAddQuestionResponse,
  TPayloadQuestionAdd,
} from '../question/question.type';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';
import { HashService } from '../hash/hash.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly keyStepperQuiz: string =
    environment.stepperQuizLocalStorageKey;
  private readonly collectionName: ECOLLECTION = ECOLLECTION.QUIZ;
  private authState = {} as TAuthState;
  private readonly keyListQuiz: string = environment.listQuizLocalStorageKey

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private hashService: HashService
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
      ECOLLECTION.USERS,
      queryExpressionUser
    );

    return users;
  }

  private async getData<T>(
    collectionName:
      | ECOLLECTION.CATEGORIES
      | ECOLLECTION.DIFFICULITIES
      | ECOLLECTION.TYPE_QUIZ
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

  private saveQuizDataToLocalStorage<T>(quiz: T): void {
    const expired = Date.now() + 1000 * 10
    const dataQuizString = JSON.stringify({quiz, expired });

    const hashDataQuiz = this.hashService.hash(dataQuizString);
    localStorage.setItem(this.keyListQuiz, hashDataQuiz)
  }

  private getQuizDataFromLocalStorage<T>(): { quiz: T[], expired: number } | null {
    const dataQuizString = localStorage.getItem(this.keyListQuiz)

    if(!dataQuizString) {
      return null
    }

    const decodeQuiz = this.hashService.decode(dataQuizString)
    const result = JSON.parse(decodeQuiz)

    return result as { quiz: T[], expired: number }
  }
  
  async getQuiz(): Promise<TResponse<TQuizTransform[]>> {
    const now = Date.now();

    const dataQuizLocalStorage = this.getQuizDataFromLocalStorage<TQuizTransform>();

    if(!dataQuizLocalStorage || dataQuizLocalStorage.expired < now) {
      const result = await firstValueFrom(await this.getQuizObservable())

      if(result.status === ESTATUS.SUCCESS && result.data) {
        this.saveQuizDataToLocalStorage(result.data)
      }

      return result;
    } 

    return {
      status: ESTATUS.SUCCESS,
      message: 'Success get quiz',
      data: dataQuizLocalStorage.quiz
    }
  }

  private async getQuizObservable(): Promise<Observable<TResponse<TQuizTransform[]>>> {
    const users = await this.getUsers();
    const categories = await this.getData<TCategory>(ECOLLECTION.CATEGORIES);
    const difficulities = await this.getData<TDifficulty>(
      ECOLLECTION.DIFFICULITIES
    );
    const typeQuiz = await this.getData<TTypeQuiz>(ECOLLECTION.TYPE_QUIZ);

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
            status: ESTATUS.SUCCESS,
            message: 'Success get quiz',
            data,
          });
        }),
        catchError((_err) => {
          return of({
            status: ESTATUS.FAIL,
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
        status: ESTATUS.SUCCESS,
        message: `Success ${
          !quiz.isPublished ? 'published' : 'unpublished'
        } quiz`,
        data: id,
      };
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
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

      if (resQuestion.status === ESTATUS.FAIL) {
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
        status: ESTATUS.SUCCESS,
        message: 'Success add quiz',
        data: results,
      };
    } catch (error) {
      return {
        status: ESTATUS.FAIL,
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
      if(deleteQuestionResponse.status === ESTATUS.FAIL) {
        throw new Error(deleteQuestionResponse.message);
      }

      const deleteAnswerResponse = await this.answerService.deleteAnswerByQuestionIds(deleteQuestionResponse.data);
      if(deleteAnswerResponse.status === ESTATUS.FAIL) {
        throw new Error(deleteAnswerResponse.message);
      }

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success deleted quiz',
        data: quiz.id
      };
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
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

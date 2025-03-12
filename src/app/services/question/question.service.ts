import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import {
  payloadAnswerAdd,
  TAddQuestionResponse,
  TPayloadQuestionAdd,
  TQuestion,
  TResultAnswer,
  TTotalQuestionsResponse,
} from './question.type';
import { ECOLLECTION } from '../../utils/constant';
import { ESTATUS, TResponse } from '../response.type';
import {
  collection,
  doc,
  Firestore,
  writeBatch,
} from '@angular/fire/firestore';
import { TAnswer } from '../answer/answer.type';
import { TQueryExpression } from '../firebase/firebase.type';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly collectionName: ECOLLECTION = ECOLLECTION.QUESTIONS;
  private readonly collectionAnswerName: ECOLLECTION =
    ECOLLECTION.ANSWERS;

  constructor(
    private firebaseService: FirebaseService,
    private firestore: Firestore,
  ) {}

  async addQuestionsWithAnswers(
    payloads: TPayloadQuestionAdd[]
  ): Promise<TResponse<TAddQuestionResponse[]>> {
    try {
      const batchQuestions = writeBatch(this.firestore);
      const questionRefs: Array<
        payloadAnswerAdd & { questionId: string; question: string }
      > = [];

      payloads.forEach((payload) => {
        const collectionRef = collection(this.firestore, this.collectionName);
        const docRef = doc(collectionRef);

        questionRefs.push({
          questionId: docRef.id,
          question: payload.question,
          answers: payload.answers,
          isCorrect: payload.isCorrect,
        });

        const payloadQuestion: Omit<TQuestion, 'id'> = {
          question: payload.question,
          quizId: payload.quizId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        batchQuestions.set(docRef, payloadQuestion);
      });

      await batchQuestions.commit();

      const batchAnswers = writeBatch(this.firestore);
      let resultAnswers: TResultAnswer[] = [];

      questionRefs.forEach((questionRef) => {
        const questionId: string = questionRef.questionId;
        let answers: { id: string; answer: string }[] = [];

        questionRef.answers.forEach((answer, index) => {
          const collectionRef = collection(
            this.firestore,
            this.collectionAnswerName
          );
          const docRef = doc(collectionRef);

          const payloadAnswer: Omit<TAnswer, 'id'> = {
            answer,
            isCorrect: questionRef.isCorrect === index,
            questionId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          answers.push({ id: docRef.id, answer });

          batchAnswers.set(docRef, payloadAnswer);
        });

        resultAnswers.push({
          id: questionId,
          question: questionRef.question,
          answers,
          isCorrect: questionRef.isCorrect,
        });
      });

      await batchAnswers.commit();

      const results: TAddQuestionResponse[] = resultAnswers.map(
        (resultAnswer) => ({
          ...resultAnswer,
          quizId: payloads[0].quizId,
        })
      );

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success add questions',
        data: results,
      };
    } catch (error) {
      return {
        status: ESTATUS.FAIL,
        message: 'Failed add questions',
      };
    }
  }

  async getTotalQuestions(): Promise<TResponse<TTotalQuestionsResponse[]>> {
    try {
      const queryExpression: TQueryExpression = {
        fieldName: 'question',
        condition: '!=',
        value: '',
      };

      const getAllQuestions =
        await this.firebaseService.getDocumentByQuery<TQuestion>(
          this.collectionName,
          [queryExpression]
        );

      const result = getAllQuestions.reduce((currVal, item) => {
        const existQuiz = currVal.find((val) => val.quizId === item.quizId);

        if (!existQuiz) {
          currVal.push({ quizId: item.quizId, totalQuestion: 1 });
        } else {
          existQuiz.totalQuestion += 1;
        }

        return currVal;
      }, [] as TTotalQuestionsResponse[]);

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success get total questions',
        data: result,
      };
    } catch (error) {
      return {
        status: ESTATUS.FAIL,
        message: 'Failed get total questions',
        data: []
      };
    }
  }

  async getQuestionsByQuizId(quizId: string): Promise<TResponse<TQuestion[]>> {
    const queryExpression: TQueryExpression = {
      fieldName: 'quizId',
      condition: '==',
      value: quizId
    }

    const questions = await this.firebaseService.getDocumentByQuery<TQuestion>(this.collectionName, [queryExpression]);

    return {
      status: ESTATUS.SUCCESS,
      message: 'Success get questions by quiz id',
      data: questions
    }
  }

  async deleteQuestionByQuizId(quizId: string): Promise<TResponse<any>> {
    try {
      const questionResponse = await this.getQuestionsByQuizId(quizId);

      if(questionResponse.data && !questionResponse.data.length) {
        throw new Error('Failed get questions by quiz id')
      }

      const questionIds = questionResponse.data?.map(({ id }) => id) as string[];

      const deleteQuestionsResponse = await this.firebaseService.deleteMultipleDocuments(this.collectionName, questionIds);

      if(!deleteQuestionsResponse.length) {
        throw new Error('Failed delete questions by quiz id')
      }

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success delete questions by quiz id',
        data: deleteQuestionsResponse
      }
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
        message: error.message ?? 'Failed delete questions by quiz id'
      }
    }
  }
}

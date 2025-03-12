import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { ESTATUS, TResponse } from '../response.type';
import { TAnswer, TPayloadAnswerAdd } from './answer.type';
import { ECOLLECTION } from '../../utils/constant';
import { TQueryExpression } from '../firebase/firebase.type';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private readonly collectionName: ECOLLECTION = ECOLLECTION.ANSWERS;

  constructor(private firebaseService: FirebaseService) {}

  async addAnswers(
    payloads: TPayloadAnswerAdd[]
  ): Promise<TResponse<TAnswer[]>> {
    try {
      const payloadAnswers: Omit<TAnswer, 'id'>[] = payloads.map((payload) => ({
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const answers = await this.firebaseService.addMultipleDocuments<
        Omit<TAnswer, 'id'>
      >(payloadAnswers, this.collectionName);

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success add answers',
        data: answers,
      };
    } catch (error) {
      return {
        status: ESTATUS.FAIL,
        message: 'Failed add answers',
      };
    }
  }

  async getAnswersByQuestionIds(questionIds: string[]): Promise<TResponse<TAnswer[]>> {
    const queryExpression: TQueryExpression = {
      fieldName: 'questionId',
      condition: 'in',
      value: questionIds
    };

    const answers = await this.firebaseService.getDocumentByQuery<TAnswer>(this.collectionName, [queryExpression]);

    return {
      status: ESTATUS.SUCCESS,
      message: 'Success get answers by question id',
      data: answers
    }
  }

  async deleteAnswerByQuestionIds(questionIds: string[]): Promise<TResponse<string[]>> {
    try {
      const answerResponse = await this.getAnswersByQuestionIds(questionIds)

      if(answerResponse.data && !answerResponse.data.length) {
        throw new Error('Failed get answers by question ids')
      }

      const answerIds = answerResponse.data?.map(({ id }) => id) as string[];
      const deleteAnswerResponse = await this.firebaseService.deleteMultipleDocuments(this.collectionName, answerIds)

      if(!deleteAnswerResponse.length) {
        throw new Error('Failed delete answers by question ids')
      }

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success delete answers by question ids',
        data: deleteAnswerResponse
      }
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
        message: error.message ?? 'Failed delete answers by question ids',
      }
    }
  }
}

import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebaseService/index.service';
import { TResponse } from '../index.type';
import { TAnswer, TPayloadAnswerAdd } from './index.type';
import { ENUMCOLLECTION } from '../../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private readonly collectionName: ENUMCOLLECTION = ENUMCOLLECTION.ANSWERS;

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
        status: 'success',
        message: 'Success add answers',
        data: answers,
      };
    } catch (error) {
      return {
        status: 'fail',
        message: 'Failed add answers',
      };
    }
  }
}

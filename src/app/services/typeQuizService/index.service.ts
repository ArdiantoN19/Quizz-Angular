import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebaseService/index.service';
import { TResponse } from '../index.type';
import { TQueryExpression } from '../firebaseService/index.type';
import { TTypeQuiz } from './index.type';
import { ENUMCOLLECTION } from '../../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class TypeQuizService {
  private readonly collectionName: ENUMCOLLECTION = ENUMCOLLECTION.TYPE_QUIZ;

  constructor(private firebaseService: FirebaseService) {}

  async getTypeQuiz(): Promise<TResponse<TTypeQuiz[]>> {
    const queryExpression: TQueryExpression[] = [
      {
        fieldName: 'name',
        condition: '!=',
        value: '',
      },
    ];
    const data = await this.firebaseService.getDocumentByQuery<TTypeQuiz>(
      this.collectionName,
      queryExpression
    );

    return {
      status: 'success',
      message: 'Success get type quiz',
      data,
    };
  }
}

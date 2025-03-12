import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { ESTATUS, TResponse } from '../response.type';
import { TQueryExpression } from '../firebase/firebase.type';
import { TTypeQuiz } from './type-quiz.type';
import { ECOLLECTION } from '../../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class TypeQuizService {
  private readonly collectionName: ECOLLECTION = ECOLLECTION.TYPE_QUIZ;

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
      status: ESTATUS.SUCCESS,
      message: 'Success get type quiz',
      data,
    };
  }
}

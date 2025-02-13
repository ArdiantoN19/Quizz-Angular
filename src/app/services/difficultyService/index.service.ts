import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebaseService/index.service';
import { TResponse } from '../index.type';
import { TQueryExpression } from '../firebaseService/index.type';
import { TDifficulty } from './index.type';

@Injectable({
  providedIn: 'root',
})
export class DifficultyService {
  constructor(private firebaseService: FirebaseService) {}

  async getDifficulities(): Promise<TResponse<TDifficulty[]>> {
    const queryExpression: TQueryExpression[] = [
      {
        fieldName: 'name',
        condition: '!=',
        value: '',
      },
    ];
    const data = await this.firebaseService.getDocumentByQuery<TDifficulty>(
      'difficulities',
      queryExpression
    );

    return {
      status: 'success',
      message: 'Success get difficulities',
      data,
    };
  }
}

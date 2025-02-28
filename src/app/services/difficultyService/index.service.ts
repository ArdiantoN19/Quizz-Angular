import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebaseService/index.service';
import { TResponse } from '../index.type';
import { TQueryExpression } from '../firebaseService/index.type';
import { TDifficulty } from './index.type';
import { ENUMCOLLECTION } from '../../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class DifficultyService {
  private readonly collectionName: ENUMCOLLECTION =
    ENUMCOLLECTION.DIFFICULITIES;

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
      this.collectionName,
      queryExpression
    );

    return {
      status: 'success',
      message: 'Success get difficulities',
      data,
    };
  }
}

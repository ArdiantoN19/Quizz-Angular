import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { ESTATUS, TResponse } from '../response.type';
import { TQueryExpression } from '../firebase/firebase.type';
import { TDifficulty } from './difficulty.type';
import { ECOLLECTION } from '../../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class DifficultyService {
  private readonly collectionName: ECOLLECTION =
    ECOLLECTION.DIFFICULITIES;

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
      status: ESTATUS.SUCCESS,
      message: 'Success get difficulities',
      data,
    };
  }
}

import { Injectable } from '@angular/core';
import { ESTATUS, TResponse } from '../index.type';
import { FirebaseService } from '../firebaseService/index.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { TCategory, TPayloadCategory } from './index.type';
import { TQueryExpression } from '../firebaseService/index.type';
import { ENUMCOLLECTION } from '../../utils/constant';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly collectionName: ENUMCOLLECTION = ENUMCOLLECTION.CATEGORIES;

  constructor(private firebaseService: FirebaseService) {}

  getCategories(): Observable<TResponse<TCategory[]>> {
    const queryExpression: TQueryExpression[] = [
      {
        fieldName: 'name',
        condition: '!=',
        value: '',
      },
    ];

    return this.firebaseService
      .getCollectionDataWithObservableByQuery<TCategory>(
        this.collectionName,
        queryExpression
      )
      .pipe(
        switchMap((category: TCategory[]) => {
          const data = category.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          })

          return of({
            status: ESTATUS.SUCCESS,
            message: 'Success get categories',
            data,
          });
        }),
        catchError((_err) => {
          return of({
            status: ESTATUS.FAIL,
            message: 'Failed get categories',
          });
        })
      );
  }

  async addCategory(payload: TPayloadCategory): Promise<TResponse<TCategory>> {
    try {
      const data: Omit<TCategory, 'id'> = {
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const category = await this.firebaseService.addDocument<typeof data>(
        data,
        this.collectionName
      );

      return {
        status: ESTATUS.SUCCESS,
        message: 'Succes add category',
        data: category,
      };
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
        message: error.message,
      };
    }
  }

  async updateCategoryById(id: string, payload: TPayloadCategory): Promise<TResponse<TCategory>> {
    try {
      const data: Omit<TCategory, 'id' | 'createdAt'> = {
        ...payload,
        updatedAt: new Date().toISOString()
      }

      const category = await this.firebaseService.getDocumentByDocId<TCategory>(this.collectionName, id);

      await this.firebaseService.updateDocumentByDocId<typeof data>(`categories/${id}`, data);

      return  {
        status: ESTATUS.SUCCESS,
        message: 'Succes update category',
        data: {
          ...category,
          ...data
        }
      }
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
        message: error.message ?? 'Error occured, please check your network'
      }
    }
  }

  async deleteCategoryById(id: string): Promise<TResponse<string>> {
    try {
      const category = await this.firebaseService.getDocumentByDocId<TCategory>(this.collectionName, id);

      await this.firebaseService.deleteDocumentByDocId(this.collectionName, id);

      return {
        status: ESTATUS.SUCCESS,
        message: 'Success delete category',
        data: category.id
      }
    } catch (error: any) {
      return {
        status: ESTATUS.FAIL,
        message: error.message ?? 'Error occured, please check your network'
      }
    }
  }
}

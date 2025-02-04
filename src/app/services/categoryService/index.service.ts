import { Injectable } from '@angular/core';
import { TResponse } from '../index.type';
import { FirebaseService } from '../firebaseService/index.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { TCategory, TPayloadCategory } from './index.type';
import { TQueryExpression } from '../firebaseService/index.type';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
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
        'categories',
        queryExpression
      )
      .pipe(
        switchMap((category: TCategory[]) => {
          const data = category.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          })

          return of({
            status: 'success',
            message: 'Success get categories',
            data,
          });
        }),
        catchError((_err) => {
          return of({
            status: 'fail',
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
        'categories'
      );

      return {
        status: 'success',
        message: 'Succes add category',
        data: category,
      };
    } catch (error: any) {
      return {
        status: 'fail',
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

      const category = await this.firebaseService.getDocumentByDocId<TCategory>('categories', id);

      await this.firebaseService.updateDocumentByDocId<typeof data>(`categories/${id}`, data);

      return  {
        status: 'success',
        message: 'Succes update category',
        data: {
          ...category,
          ...payload
        }
      }
    } catch (error: any) {
      return {
        status: 'fail',
        message: error.message ?? 'Error occured, please check your network'
      }
    }
  }
}

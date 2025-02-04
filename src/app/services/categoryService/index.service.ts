import { Injectable } from "@angular/core";
import { TResponse } from "../index.type";
import { FirebaseService } from "../firebaseService/index.service";
import { catchError, Observable, of, switchMap } from "rxjs";
import { TCategory } from "./index.type";
import { TQueryExpression } from "../firebaseService/index.type";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private firebaseService: FirebaseService) {}

    getCategories(): Observable<TResponse<TCategory[]>> {
        const queryExpression: TQueryExpression[] = [
            {
                fieldName: 'name',
                condition: '!=',
                value: ''
            }
        ]

        return this.firebaseService.getCollectionDataWithObservableByQuery<TCategory>('categories', queryExpression)
            .pipe(
            switchMap((category: TCategory[]) => {
                return of({
                    status: 'success',
                    message: 'Success get categories',
                    data: category
                })
            }),
            catchError((_err) => {
                return of({
                    status: 'fail',
                    message: 'Failed get categories',
                })
            })
        )
    }
}
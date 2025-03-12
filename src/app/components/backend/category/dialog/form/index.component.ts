import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorCustomMessageService } from '../../../../../utils/errorCustomMessage.service';
import { SlugPipe } from '../../../../../pipes/slug.pipe';
import { CategoryPageApp } from '../../../../../pages/backend/category/index.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../../../services/categoryService/index.service';
import { formatSlug } from '../../../../../utils';
import { TCategory } from '../../../../../services/categoryService/index.type';
import { ESTATUS, TResponse } from '../../../../../services/index.type';

type TDialogData = {
    mode: 'new' | 'edit',
    data?: TCategory
}

@Component({
  selector: 'dialog-form-category-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SlugPipe
  ],
})
export class DialogFormCategoryAppComponent implements OnInit {
    private errorMessageService = inject(ErrorCustomMessageService);
    private dialogRef =  inject(MatDialogRef<CategoryPageApp>);
    private snackbar = inject(MatSnackBar)
    private categoryService = inject(CategoryService)
    data = inject<TDialogData>(MAT_DIALOG_DATA)

    categoryForm = new FormGroup({
        name: new FormControl<string>('', [Validators.required]),
    })

    ngOnInit(): void {
        if(this.data.mode === 'edit' && this.data.data) {
            this.categoryForm.setValue({
                name: this.data.data.name
            })
        }
    }

    getErrorMessage(name: 'name'): string {
        const control = this.categoryForm.get(name) as any
        return this.errorMessageService.getMessage(control, name)
    }

    async onSubmitHandler(): Promise<void> {
        if(this.categoryForm.valid) {
            const payload = {
                name: this.categoryForm.value.name!.trim(),
                slug: formatSlug(this.categoryForm.value.name!.trim())
            }
            let response: TResponse<TCategory> = {} as TResponse<TCategory>

            if(this.data.mode === 'new') {
                response = await this.categoryService.addCategory(payload);
            } else {
                response = await this.categoryService.updateCategoryById(this.data.data?.id!, payload)
            }
            
            this.snackbar.open(response.message, 'close');

            if(response.status === ESTATUS.SUCCESS) {
                this.dialogRef.close(response)
            }
        }
    }
}

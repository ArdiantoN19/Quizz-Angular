import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CategoryService } from "../../../../../services/category/category.service";
import { CategoryPageApp } from "../../../../../pages/backend/category/category.component";
import { ESTATUS } from "../../../../../services/response.type";

type TDataDialog = {
    id: string;
}

@Component({
    selector: 'dialog-confirm-category-app',
    templateUrl: 'dialog-confirm.component.html',
    imports: [MatDialogModule, MatButtonModule]
})
export class DialogConfirmCategoryAppComponent {
    private data = inject<TDataDialog>(MAT_DIALOG_DATA)
    private dialogRef = inject(MatDialogRef<CategoryPageApp>)
    private categoryService = inject(CategoryService);
    private snackbar = inject(MatSnackBar);
    
    async onDeleteHandler(): Promise<void> {
        const response = await this.categoryService.deleteCategoryById(this.data.id)
        
       if(response.status === ESTATUS.SUCCESS) {
            this.dialogRef.close(response)
       }

       this.snackbar.open(response.message, 'close')
    }
}
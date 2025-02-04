import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CategoryService } from "../../../../../services/categoryService/index.service";
import { CategoryPageApp } from "../../../../../pages/backend/category/index.component";

type TDataDialog = {
    id: string;
}

@Component({
    selector: 'dialog-confirm-backend-app',
    templateUrl: 'index.component.html',
    imports: [MatDialogModule, MatButtonModule]
})
export class DialogConfirmBackendAppComponent {
    private data = inject<TDataDialog>(MAT_DIALOG_DATA)
    private dialogRef = inject(MatDialogRef<CategoryPageApp>)
    private categoryService = inject(CategoryService);
    private snackbar = inject(MatSnackBar);
    
    async onDeleteHandler(): Promise<void> {
        const response = await this.categoryService.deleteCategoryById(this.data.id)
        
       if(response.status === 'success') {
            this.dialogRef.close(response)
       }

       this.snackbar.open(response.message, 'close')
    }
}
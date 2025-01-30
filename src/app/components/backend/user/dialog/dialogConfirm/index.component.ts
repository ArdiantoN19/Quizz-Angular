import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { UserPageApp } from "../../../../../pages/backend/user/index.component";
import { UserService } from "../../../../../services/userService/index.service";
import { MatSnackBar } from "@angular/material/snack-bar";

type TDataDialog = {
    id: string;
}

@Component({
    selector: 'dialog-confirm-backend-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [MatDialogModule, MatButtonModule]
})
export class DialogConfirmBackendAppComponent {
    private data = inject<TDataDialog>(MAT_DIALOG_DATA)
    private dialogRef = inject(MatDialogRef<UserPageApp>)
    private userServie = inject(UserService);
    private snackbar = inject(MatSnackBar);
    
    async onDeleteHandler(): Promise<void> {
        const response = await this.userServie.deleteUserById(this.data.id)
        
       if(response.status === 'success') {
            this.dialogRef.close(response)
       }

       this.snackbar.open(response.message, 'close')
    }
}
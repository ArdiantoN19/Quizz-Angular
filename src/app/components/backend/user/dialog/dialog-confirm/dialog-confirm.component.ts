import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { UserPageApp } from "../../../../../pages/backend/user/user.component";
import { UserService } from "../../../../../services/user/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ESTATUS } from "../../../../../services/response.type";

type TDataDialog = {
    id: string;
}

@Component({
    selector: 'dialog-confirm-user-app',
    templateUrl: 'dialog-confirm.component.html',
    styleUrl: 'dialog-confirm.component.scss',
    imports: [MatDialogModule, MatButtonModule]
})
export class DialogConfirmUserAppComponent {
    private data = inject<TDataDialog>(MAT_DIALOG_DATA)
    private dialogRef = inject(MatDialogRef<UserPageApp>)
    private userService = inject(UserService);
    private snackbar = inject(MatSnackBar);
    
    async onDeleteHandler(): Promise<void> {
        const response = await this.userService.deleteUserById(this.data.id)
        
       if(response.status === ESTATUS.SUCCESS) {
            this.dialogRef.close(response)
       }

       this.snackbar.open(response.message, 'close')
    }
}
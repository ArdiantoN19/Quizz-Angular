import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { UserPageApp } from "../../../../../pages/backend/user/index.component";

@Component({
    selector: 'dialog-confirm-backend-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [MatDialogModule, MatButtonModule]
})
export class DialogConfirmBackendAppComponent {
    data = inject<any>(MAT_DIALOG_DATA)
    private dialogRef = inject(MatDialogRef<UserPageApp>)
    
    onDeleteHandler() {
        this.dialogRef.close(true)
    }
}
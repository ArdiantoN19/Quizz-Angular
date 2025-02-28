import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { QuizStepperAppComponent } from "../index.component";

@Component({
    selector: 'dialog-reset-quiz-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [MatDialogModule, MatButtonModule]
})
export class DialogResetQuizAppComponent {
    private dialogRef = inject(MatDialogRef<QuizStepperAppComponent>)

    onResetHandler() {
        this.dialogRef.close(true)
    }
}
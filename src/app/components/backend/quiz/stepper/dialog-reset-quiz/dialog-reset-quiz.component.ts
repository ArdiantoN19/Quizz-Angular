import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { StepperQuizAppComponent } from "../stepper.component";

@Component({
    selector: 'dialog-reset-quiz-app',
    templateUrl: 'dialog-reset-quiz.component.html',
    styleUrl: 'dialog-reset-quiz.component.scss',
    imports: [MatDialogModule, MatButtonModule]
})
export class DialogResetQuizAppComponent {
    private dialogRef = inject(MatDialogRef<StepperQuizAppComponent>)

    onResetHandler() {
        this.dialogRef.close(true)
    }
}
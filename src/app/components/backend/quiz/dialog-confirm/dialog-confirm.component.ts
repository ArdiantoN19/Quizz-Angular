import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizService } from '../../../../services/quizService/index.service';
import { ESTATUS } from '../../../../services/index.type';

type TDialogData = {
  id: string;
};

@Component({
  selector: 'dialog-confirm-quiz-app',
  templateUrl: 'dialog-confirm.component.html',
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogConfirmQuizAppComponent {
  private data = inject<TDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<DialogConfirmQuizAppComponent>);
  private snackbar = inject(MatSnackBar);
  private quizService = inject(QuizService);
  isLoading: boolean = false;

  async onDeleteHandler(): Promise<void> {
    this.isLoading = true;
    const { id } = this.data;

    const result = await this.quizService.deleteQuizById(id);
    if (result.status === ESTATUS.SUCCESS) {
        this.dialogRef.close(result.data);
    }
    
    this.isLoading = false;
    this.snackbar.open(result.message, 'close');
  }
}

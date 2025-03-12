import { Component, inject, OnInit } from '@angular/core';
import { TitleBackendAppComponent } from '../../../components/backend/title/index.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { QuizCardAppComponent } from '../../../components/backend/quiz/card/index.component';
import { QuizService } from '../../../services/quizService/index.service';
import { TQuizTransform } from '../../../services/quizService/index.type';
import { SkeletonAppComponent } from '../../../components/skeleton/index.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmQuizAppComponent } from '../../../components/backend/quiz/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'quiz-page-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    TitleBackendAppComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    QuizCardAppComponent,
    SkeletonAppComponent,
    RouterLink
  ],
})
export class QuizPageApp implements OnInit {
  private quizService = inject(QuizService);
  private snackbar = inject(MatSnackBar);
  private dialog = inject(MatDialog)

  protected dataTitle = {
    title: 'Quiz',
    subtitle: 'You can manage quiz here.',
  };
  protected isLoading: boolean = true;

  protected dataQuiz$: TQuizTransform[] = [];

  ngOnInit(): void {
    (async () => {
      (await this.quizService.getQuiz()).subscribe((result) => {
        if (result.status === 'success' && result.data) {
          this.dataQuiz$ = result.data;
        }

        this.isLoading = false;
      });
    })();
  }

  async onPublishHandler(id: string) {
    let copyData = [...this.dataQuiz$];
    const response = await this.quizService.updatePublishQuiz(id);

    if (response.status === 'success' && response.data) {
      const indexData = copyData.findIndex((data) => data.id === response.data);

      if (indexData !== -1) {
        copyData[indexData] = {
          ...copyData[indexData],
          isPublished: !copyData[indexData].isPublished,
        };
      }
    }

    const snackbarRef = this.snackbar.open(response.message, 'close');
    snackbarRef.afterDismissed().subscribe(() => {
      this.dataQuiz$ = copyData;
    });
  }

  onDeleteHandler(id: string) {
    const dialogRef = this.dialog.open(DialogConfirmQuizAppComponent, {
      data: {
        id
      }
    })

    dialogRef.afterClosed().subscribe((result: string) => {
      let quiz = [...this.dataQuiz$]
      quiz = quiz.filter((data) => data.id !== result);
      this.dataQuiz$ = quiz
    })
  }
}

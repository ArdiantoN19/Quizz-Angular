import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TQuizTransform } from '../../../../services/quizService/index.type';

@Component({
  selector: 'quiz-card-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    MatSlideToggleModule,
  ],
})
export class QuizCardAppComponent {
  @Input({ required: true }) data!: TQuizTransform[];

  @Output() eventPublish = new EventEmitter<string>();
  @Output() eventDelete = new EventEmitter<string>();

  onPublishHandler(id: string) {
    this.eventPublish.emit(id);
  }

  onDeleteHandler(id: string) {
    this.eventDelete.emit(id);
  }
}

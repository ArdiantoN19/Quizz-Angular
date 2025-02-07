import { Component, inject, OnInit } from "@angular/core";
import { TitleBackendAppComponent } from "../../../components/backend/title/index.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { QuizCardAppComponent } from "../../../components/backend/quiz/card/index.component";
import { QuizService } from "../../../services/quizService/index.service";
import { TQuizTransform } from "../../../services/quizService/index.type";
import { SkeletonAppComponent } from "../../../components/skeleton/index.component";

@Component({
    selector: 'quiz-page-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [TitleBackendAppComponent, MatButtonModule, MatIconModule, MatTooltip, QuizCardAppComponent, SkeletonAppComponent]
})
export class QuizPageApp implements OnInit {
    private quizService = inject(QuizService)

    protected dataTitle = {
        title: 'Quiz',
        subtitle: 'You can manage quiz here.'
    }
    protected isLoading: boolean = true;

    protected dataQuiz$: TQuizTransform[] = []

    ngOnInit(): void {
        (async() => {
            (await this.quizService.getQuiz()).subscribe((result) => {
                if(result.status === 'success' && result.data) {
                    this.dataQuiz$ = result.data
                }

                this.isLoading = false
            })
        })()
    }
}
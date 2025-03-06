import { Component, inject } from "@angular/core";
import { TitleBackendAppComponent } from "../../../../components/backend/title/index.component";
import { QuizStepperAppComponent } from "../../../../components/backend/quiz/stepper/index.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";

@Component({
    selector: 'quiz-add-page-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [TitleBackendAppComponent, QuizStepperAppComponent, MatButtonModule, MatIconModule, MatTooltipModule]
})
export class QuizAddPageApp {
    dataTitle = {
        title: 'Add Quiz',
        subtitle: 'You can add and setup your quiz here.'
    }

    private router = inject(Router)

    onBackHandler() {
        this.router.navigate(['/admin/quiz',])
    }
}
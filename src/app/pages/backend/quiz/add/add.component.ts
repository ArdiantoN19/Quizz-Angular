import { Component, inject } from "@angular/core";
import { HeaderTitleBackendAppComponent } from "../../../../components/backend/shared/header-title/header-title.component";
import { StepperQuizAppComponent } from "../../../../components/backend/quiz/stepper/stepper.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";

@Component({
    selector: 'add-quiz-page-app',
    templateUrl: 'add.component.html',
    styleUrl: 'add.component.scss',
    imports: [HeaderTitleBackendAppComponent, StepperQuizAppComponent, MatButtonModule, MatIconModule, MatTooltipModule]
})
export class AddQuizPageApp {
    dataTitle = {
        title: 'Add Quiz',
        subtitle: 'You can add and setup your quiz here.'
    }

    private router = inject(Router)

    onBackHandler() {
        this.router.navigate(['/admin/quiz',])
    }
}
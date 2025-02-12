import { Component } from "@angular/core";
import { TitleBackendAppComponent } from "../../../../components/backend/title/index.component";
import { QuizStepperAppComponent } from "../../../../components/backend/quiz/stepper/index.component";

@Component({
    selector: 'quiz-add-page-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [TitleBackendAppComponent, QuizStepperAppComponent]
})
export class QuizAddPageApp {
    dataTitle = {
        title: 'Add Quiz',
        subtitle: 'You can add and setup your quiz here.'
    }
}
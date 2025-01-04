import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

type TFeature = {
    title: string;
    description: string;
    class: string;
    icon: string;
}

const features: TFeature[] = [
    {
        title: 'Various Categories',
        description: 'Quizzes covering various categories such as history, science, mathematics, pop culture, and logic.',
        class: 'card-primary',
        icon: 'palette',
    },
    {
        title: 'Difficulty Level',
        description: 'Ranging quiz from easy to advanced.',
        class: 'card-secondary',
        icon: 'extension',
    },
    {
        title: 'Leaderboard',
        description: 'Displays the ranking of players with the highest scores.',
        class: 'card-tertiary',
        icon: 'emoji_events',
    }
]
@Component({
    selector: 'feature-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [MatCardModule, MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureAppComponent {
    features: TFeature[] = features
}
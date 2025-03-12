import { Component } from "@angular/core";
import { FeatureAppComponent } from "../../../components/feature/feature.component";
import { CtaComponent } from "../../../components/cta/cta.component";

@Component({
    selector: 'feature-page-app',
    templateUrl: 'feature.component.html',
    styleUrl: 'feature.component.scss',
    imports: [FeatureAppComponent, CtaComponent]
})
export class FeaturePageApp {}
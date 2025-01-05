import { Component } from "@angular/core";
import { FeatureAppComponent } from "../../../components/feature/index.component";
import { CtaComponent } from "../../../components/cta/index.component";

@Component({
    selector: 'feature-page-app',
    templateUrl: 'index.component.html',
    imports: [FeatureAppComponent, CtaComponent]
})
export class FeaturePageApp {}
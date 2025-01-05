import { Component } from "@angular/core";
import { TestimonialComponent } from "../../../components/testimonial/index.component";

@Component({
    selector: 'about-us-page-app',
    templateUrl: 'index.component.html',
    imports: [TestimonialComponent]
})
export class AboutUsPageApp {}
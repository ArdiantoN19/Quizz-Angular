import { Component } from "@angular/core";
import { TestimonialComponent } from "../../../components/testimonial/testimonial.component";

@Component({
    selector: 'about-us-page-app',
    templateUrl: 'about-us.component.html',
    imports: [TestimonialComponent]
})
export class AboutUsPageApp {}
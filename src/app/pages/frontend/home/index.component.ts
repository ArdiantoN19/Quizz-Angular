import { Component } from "@angular/core";
import { HeroAppComponent } from "../../../components/hero/index.component";
import { FeatureAppComponent } from "../../../components/feature/index.component";
import { CtaComponent } from "../../../components/cta/index.component";
import { TestimonialComponent } from "../../../components/testimonial/index.component";
import { ContactUsAppComponent } from "../../../components/contactUs/index.component";
import { SubscribeAppComponent } from "../../../components/subscribe/index.component";

@Component({
    selector: 'home-page-app',
    templateUrl: 'index.component.html',
    imports: [HeroAppComponent, FeatureAppComponent, CtaComponent, TestimonialComponent, ContactUsAppComponent, SubscribeAppComponent]
})
export class HomePageApp {}
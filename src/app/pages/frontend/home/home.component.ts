import { Component } from "@angular/core";
import { HeroAppComponent } from "../../../components/hero/hero.component";
import { FeatureAppComponent } from "../../../components/feature/feature.component";
import { CtaComponent } from "../../../components/cta/cta.component";
import { TestimonialComponent } from "../../../components/testimonial/testimonial.component";
import { ContactUsAppComponent } from "../../../components/contact-us/contact-us.component";
import { SubscribeAppComponent } from "../../../components/subscribe/subscribe.component";

@Component({
    selector: 'home-page-app',
    templateUrl: 'home.component.html',
    imports: [HeroAppComponent, FeatureAppComponent, CtaComponent, TestimonialComponent, ContactUsAppComponent, SubscribeAppComponent]
})
export class HomePageApp {}
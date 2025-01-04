import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarAppComponent } from './components/navbar/index.component';
import { HeroAppComponent } from './components/hero/index.component';
import { FeatureAppComponent } from "./components/feature/index.component";
import { CtaComponent } from "./components/cta/index.component";
import { TestimonialComponent } from "./components/testimonial/index.component";
import { ContactUsAppComponent } from "./components/contactUs/index.component";
import { SubscribeAppComponent } from "./components/subscribe/index.component";
import { FooterAppComponent } from "./components/footer/index.component";
import { ScrollToTopAppComponent } from "./components/scrollToTop/index.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarAppComponent, HeroAppComponent, FeatureAppComponent, CtaComponent, TestimonialComponent, ContactUsAppComponent, SubscribeAppComponent, FooterAppComponent, ScrollToTopAppComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'quizz';
}

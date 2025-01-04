import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarApp } from './components/navbar/index.component';
import { HeroApp } from './components/hero/index.component';
import { FeatureApp } from "./components/feature/index.component";
import { CtaComponent } from "./components/cta/index.component";
import { TestimonialComponent } from "./components/testimonial/index.component";
import { ContactUsApp } from "./components/contactUs/index.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarApp, HeroApp, FeatureApp, CtaComponent, TestimonialComponent, ContactUsApp],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'quizz';
}

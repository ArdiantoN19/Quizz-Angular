import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarApp } from './components/navbar/index.component';
import { HeroApp } from './components/hero/index.component';
import { FeatureApp } from "./components/feature/index.component";
import { CtaComponent } from "./components/cta/index.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarApp, HeroApp, FeatureApp, CtaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'quizz';
}

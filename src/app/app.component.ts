import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarApp } from './components/navbar/index.component';
import { HeroApp } from './components/hero/index.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarApp, HeroApp],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'quizz';
}

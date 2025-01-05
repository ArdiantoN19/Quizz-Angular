import { Component } from '@angular/core';
import { FrontendLayoutAppComponent } from './shared/frontend/layout/index.component';

@Component({
  selector: 'app-root',
  imports: [FrontendLayoutAppComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'quizz';
}

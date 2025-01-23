import { Component } from '@angular/core';
import { FrontendLayoutAppComponent } from './layouts/frontend/index.component';
import { BackendLayoutAppComponent } from "./layouts/backend/index.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'quizz';
}

import { Component } from '@angular/core';
import { LayoutFrontendAppComponent } from './layouts/frontend/frontend.component';
import { LayoutBackendAppComponent } from "./layouts/backend/backend.component";
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

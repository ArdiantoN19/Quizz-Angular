import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'navbar-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class NavbarApp {
  isDrawerOpen: boolean = false;

  onOpenDrawerHandler() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}

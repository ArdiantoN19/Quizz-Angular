import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'navbar-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink, RouterLinkActive],
})
export class NavbarAppComponent {
  isDrawerOpen: boolean = false;
  isShowShadow: boolean = false;

  @HostListener('window:scroll',[])
  onShowShadow(): void {
    this.isShowShadow = window.scrollY > 50
  }

  onOpenDrawerHandler(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}

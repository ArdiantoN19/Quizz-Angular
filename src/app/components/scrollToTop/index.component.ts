import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'scroll-to-top-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [MatIconModule, MatTooltipModule],
  encapsulation: ViewEncapsulation.None
})
export class ScrollToTopAppComponent {
  isVisible: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isVisible = window.scrollY > 200;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

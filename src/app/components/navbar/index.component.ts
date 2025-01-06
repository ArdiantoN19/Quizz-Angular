import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'navbar-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink, RouterLinkActive],
  encapsulation: ViewEncapsulation.None
})
export class NavbarAppComponent implements OnInit {
  isDrawerOpen: boolean = false;
  isShowShadow: boolean = false;
  currentRoute: string = '';

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.route.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isDrawerOpen = false
      this.currentRoute = encodeURIComponent(this.route.url == '/' ? '/home' : this.route.url)
    })
  }

  @HostListener('window:scroll',[])
  onShowShadow(): void {
    this.isShowShadow = window.scrollY > 50
  }

  onOpenDrawerHandler(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}

import { Component, OnInit } from '@angular/core';
import { NavbarAppComponent } from '../../components/navbar/index.component';
import { FooterAppComponent } from '../../components/footer/index.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ScrollToTopAppComponent } from '../../components/scrollToTop/index.component';
import { filter } from 'rxjs';

const authRoutes: string[] = ['/login', '/register'];

@Component({
  selector: 'frontend-layout-app',
  templateUrl: 'index.component.html',
  imports: [
    NavbarAppComponent,
    FooterAppComponent,
    RouterOutlet,
    ScrollToTopAppComponent,
  ],
})
export class FrontendLayoutAppComponent implements OnInit {
  isAuthPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
    ).subscribe((event) => {
        const currentRoute: string = this.router.url.split('?')[0];
        this.isAuthPage = authRoutes.includes(currentRoute)
    })
  }
}

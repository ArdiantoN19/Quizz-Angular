import { Component, OnInit } from '@angular/core';
import { NavbarAppComponent } from '../../components/navbar/navbar.component';
import { FooterAppComponent } from '../../components/footer/footer.component';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { ScrollToTopAppComponent } from '../../components/scroll-to-top/scroll-to-top.component';
import { filter } from 'rxjs';

const authRoutes: string[] = ['/login', '/register'];

@Component({
  selector: 'layout-frontend-app',
  templateUrl: 'frontend.component.html',
  imports: [
    NavbarAppComponent,
    FooterAppComponent,
    RouterOutlet,
    ScrollToTopAppComponent,
  ],
})
export class LayoutFrontendAppComponent implements OnInit {
  isAuthPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentRoute: string = this.router.url.split('?')[0];
    this.isAuthPage = authRoutes.includes(currentRoute);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentRoute: string = this.router.url.split('?')[0];
        this.isAuthPage = authRoutes.includes(currentRoute);
      });
  }
}

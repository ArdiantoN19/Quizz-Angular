import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs';
import { TAuthState } from '../../services/authService/index.type';
import { AuthService } from '../../services/authService/index.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'navbar-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarAppComponent implements OnInit {
  isDrawerOpen: boolean = false;
  isShowShadow: boolean = false;
  currentRoute: string = '';
  authState: TAuthState | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isDrawerOpen = false;
        this.currentRoute = encodeURIComponent(
          this.router.url == '/' ? '/home' : this.router.url
        );
      });

    this.authState = this.authService.getAuthState();
  }

  @HostListener('window:scroll', [])
  onShowShadow(): void {
    this.isShowShadow = window.scrollY > 50;
  }

  onOpenDrawerHandler(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  onLogoutHandler() {
    this.authService.logout()
    this.authState = null;
  }
}

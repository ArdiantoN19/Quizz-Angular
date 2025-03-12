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
import { TAuthState } from '../../services/auth/auth.type';
import { AuthService } from '../../services/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'navbar-app',
  templateUrl: 'navbar.component.html',
  styleUrl: 'navbar.component.scss',
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
  isAdmin: boolean = false;

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

    const authState = this.authService.getAuthState();
    this.authState = authState;
    this.isAdmin = ['ADMIN', 'SUPERADMIN'].includes(authState?.role!);
  }

  @HostListener('window:scroll', [])
  onShowShadow(): void {
    this.isShowShadow = window.scrollY > 50;
  }

  onOpenDrawerHandler(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  onLogoutHandler() {
    this.authService.logout();
    this.authState = null;
  }
}

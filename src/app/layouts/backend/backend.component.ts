import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth/auth.service';
import { TAuthState } from '../../services/auth/auth.type';
import { MatMenuModule } from '@angular/material/menu';

type TMenu = {
    label: string;
    icon: string;
    link: string;
}

const menus: TMenu[] = [
    {
        label: 'Dashboard',
        icon: 'dashboard',
        link: '/dashboard'
    },
    {
        label: 'Users',
        icon: 'group',
        link: '/user'
    },
    {
        label: 'Category',
        icon: 'palette',
        link: '/category'
    },
    {
        label: 'Quiz',
        icon: 'extension',
        link: '/quiz'
    }
]

@Component({
  selector: 'layout-backend-app',
  templateUrl: 'backend.component.html',
  styleUrl: 'backend.component.scss',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    RouterLinkActive
  ],
  encapsulation: ViewEncapsulation.None
})
export class LayoutBackendAppComponent {
  private maxWidthTablet: number = 769;
  isTabletMode: boolean = false;
  authState: TAuthState | null = null;
  menuAdmin: TMenu[] = menus

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const innerWidth = window.innerWidth;
    this.isTabletMode = innerWidth < this.maxWidthTablet;

    const authState = this.authService.getAuthState();
    this.authState = authState;
  }

  @HostListener('window:resize', [])
  onResizeHandler() {
    const innerWidth = window.innerWidth;
    this.isTabletMode = innerWidth < this.maxWidthTablet;
  }

  onLogoutHandler(): void {
    this.authService.logout()
    this.authState = null;
    this.router.navigate(['/'])
  }
}

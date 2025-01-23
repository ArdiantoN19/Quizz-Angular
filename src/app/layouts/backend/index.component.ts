import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/authService/index.service';
import { TAuthState } from '../../services/authService/index.type';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'backend-layout-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class BackendLayoutAppComponent {
  private maxWidthTablet: number = 769;
  isTabletMode: boolean = false;
  authState: TAuthState | null = null;

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

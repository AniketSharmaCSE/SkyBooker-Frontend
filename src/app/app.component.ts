import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 140px);
    }
  `]
})
export class AppComponent {
  title = 'SkyBooker';

  constructor(private authService: AuthService) {}

  // Auto-logout when tab or browser is closed
  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    this.authService.logout();
  }
}

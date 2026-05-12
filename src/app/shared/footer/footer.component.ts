import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="sky-footer text-center py-3">
      <div class="container">
        <p class="mb-0 small" style="color: #9ca3af;">© 2026 SkyBooker — Airline Ticket Booking System</p>
      </div>
    </footer>
  `,
  styles: [`
    .sky-footer {
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
    }
  `]
})
export class FooterComponent {}

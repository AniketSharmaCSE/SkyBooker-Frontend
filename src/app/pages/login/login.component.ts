import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const role = this.auth.getRole();
        this.router.navigate(role === 'STAFF' ? ['/staff'] : ['/']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Invalid credentials. Please try again.';
        this.loading = false;
      }
    });
  }
}

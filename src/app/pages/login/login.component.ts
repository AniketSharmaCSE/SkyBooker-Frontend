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
    this.error = '';
    const validationError = this.validate();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.loading = true;
    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
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

  private validate(): string {
    const email = this.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Enter a valid email address.';
    }
    if (!this.isStrongPassword(this.password)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
    }
    return '';
  }

  private isStrongPassword(password: string): boolean {
    return password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
  }
}

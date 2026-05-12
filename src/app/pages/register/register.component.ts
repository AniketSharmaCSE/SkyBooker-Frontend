import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  role = 'PASSENGER';
  error = '';
  success = '';
  loading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  register(): void {
    this.error = '';
    this.success = '';
    const validationError = this.validate();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.loading = true;

    this.auth.register({
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed.';
      }
    });
  }

  private validate(): string {
    if (this.fullName.trim().length < 2) {
      return 'Enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
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

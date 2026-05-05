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
    this.loading = true;

    this.auth.register({
      fullName: this.fullName,
      email: this.email,
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
}

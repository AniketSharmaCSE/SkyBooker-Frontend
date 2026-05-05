import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Subscription, interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  role = '';
  fullName = '';
  unreadCount = 0;
  private subs = new Subscription();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.authService.isLoggedIn$.subscribe(val => {
        this.isLoggedIn = val;
        this.role = this.authService.getRole();
        this.fullName = this.authService.getFullName();
        if (val && this.role === 'PASSENGER') {
          this.fetchUnread();
        }
      })
    );
  }

  fetchUnread(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: res => this.unreadCount = res.unreadCount,
      error: () => this.unreadCount = 0
    });
  }

  logout(): void {
    this.authService.logout();
    this.unreadCount = 0;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

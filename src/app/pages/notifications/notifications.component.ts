import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationItem } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationItem[] = [];
  loading = true;

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.notifService.getMyNotifications().subscribe({
      next: data => { this.notifications = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  markRead(id: number): void {
    this.notifService.markAsRead(id).subscribe({
      next: () => {
        const n = this.notifications.find(x => x.id === id);
        if (n) n.isRead = true;
      }
    });
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}

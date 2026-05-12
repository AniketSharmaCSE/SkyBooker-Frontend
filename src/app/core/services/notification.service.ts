import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationItem } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API = '/notifications';

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.API}/my`);
  }

  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.API}/my/unread-count`);
  }

  markAsRead(id: number): Observable<NotificationItem> {
    return this.http.put<NotificationItem>(`${this.API}/${id}/read`, {});
  }

  getByPassenger(passengerId: number): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.API}/passenger/${passengerId}`);
  }

  getUnreadCountByPassenger(passengerId: number): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.API}/passenger/${passengerId}/unread-count`);
  }
}

export interface NotificationItem {
  id: number;
  passengerId: number;
  relatedBookingId: number | null;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

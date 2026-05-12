import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { BookingResponse } from '../../../core/models/booking.model';
import { formatFlightId, formatPassengerId } from '../../../core/utils/display.utils';

@Component({
  selector: 'app-manage-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-bookings.component.html',
  styleUrl: './manage-bookings.component.scss'
})
export class ManageBookingsComponent implements OnInit {
  bookings: BookingResponse[] = [];
  totalCount = 0;
  flightIdFilter: number | null = null;
  loading = true;

  formatFlightId = formatFlightId;
  formatPassengerId = formatPassengerId;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.bookingService.getAllBookings(this.flightIdFilter || undefined).subscribe({
      next: data => {
        this.bookings = data.bookings;
        this.totalCount = data.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

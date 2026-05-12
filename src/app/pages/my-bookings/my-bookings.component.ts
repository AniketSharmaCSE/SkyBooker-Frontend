import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { BookingResponse } from '../../core/models/booking.model';
import { formatFlightId } from '../../core/utils/display.utils';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading = true;
  pnrSearch = '';
  searchResult: BookingResponse | null = null;
  searchError = '';
  cancelMessage = '';

  formatFlightId = formatFlightId;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getMyBookings().subscribe({
      next: data => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  searchByPnr(): void {
    this.searchError = '';
    this.searchResult = null;
    if (!this.pnrSearch.trim()) return;

    this.bookingService.getByPnr(this.pnrSearch.trim()).subscribe({
      next: res => this.searchResult = res,
      error: err => this.searchError = err.error?.message || 'Booking not found.'
    });
  }

  cancelBooking(pnr: string): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    this.cancelMessage = '';

    this.bookingService.cancelBooking(pnr).subscribe({
      next: res => {
        this.cancelMessage = res.message;
        this.loadBookings();
      },
      error: err => {
        this.cancelMessage = err.error?.message || 'Cancel failed.';
      }
    });
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

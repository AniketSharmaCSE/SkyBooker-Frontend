import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlightService } from '../../../core/services/flight.service';
import { BookingService } from '../../../core/services/booking.service';
import { PassengerService } from '../../../core/services/passenger.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-dashboard.component.html',
  styleUrl: './staff-dashboard.component.scss'
})
export class StaffDashboardComponent implements OnInit {
  totalFlights = 0;
  totalBookings = 0;
  totalPassengers = 0;
  loading = true;

  constructor(
    private flightService: FlightService,
    private bookingService: BookingService,
    private passengerService: PassengerService
  ) {}

  ngOnInit(): void {
    this.flightService.searchFlights().subscribe({
      next: data => this.totalFlights = data.length,
      error: () => {}
    });

    this.bookingService.getAllBookings().subscribe({
      next: data => this.totalBookings = data.totalCount,
      error: () => {}
    });

    this.passengerService.getAllPassengers().subscribe({
      next: data => { this.totalPassengers = data.totalCount; this.loading = false; },
      error: () => this.loading = false
    });
  }
}

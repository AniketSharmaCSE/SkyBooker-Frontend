import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FlightService } from '../../core/services/flight.service';
import { AuthService } from '../../core/services/auth.service';
import { FlightResponse } from '../../core/models/flight.model';
import { CITIES, getCityCode, formatFlightId, getAirlineName } from '../../core/utils/display.utils';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss'
})
export class FlightsComponent implements OnInit {
  flights: FlightResponse[] = [];
  loading = false;
  origin = '';
  destination = '';
  date = '';
  message = '';
  error = '';
  cities = CITIES;

  getCityCode = getCityCode;
  formatFlightId = formatFlightId;
  getAirlineName = getAirlineName;

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.origin = params['origin'] || '';
      this.destination = params['destination'] || '';
      this.date = params['date'] || '';
      this.search();
    });
  }

  search(): void {
    this.loading = true;
    this.message = '';
    this.error = '';

    const request$ = this.isStaff()
      ? this.flightService.getAllFlights(
          this.origin || undefined,
          this.destination || undefined,
          this.date || undefined
        )
      : this.flightService.searchFlights(
          this.origin || undefined,
          this.destination || undefined,
          this.date || undefined
        );

    request$.subscribe({
      next: (data) => {
        this.flights = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load flights.';
        this.loading = false;
      }
    });
  }

  refineSearch(): void {
    this.router.navigate(['/flights'], {
      queryParams: {
        origin: this.origin || undefined,
        destination: this.destination || undefined,
        date: this.date || undefined
      }
    });
  }

  bookFlight(flightId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/booking/${flightId}` } });
      return;
    }
    if (this.authService.getRole() !== 'PASSENGER') {
      return; // Staff can't book
    }
    this.router.navigate(['/booking', flightId]);
  }

  manageSeats(flightId: string | number): void {
    this.router.navigate(['/booking', flightId]);
  }

  cancelFlight(flight: FlightResponse): void {
    if (!confirm(`Cancel flight ${flight.flightNumber}? This will stop new bookings.`)) return;

    this.flightService.cancelFlight(flight.id).subscribe({
      next: (res) => {
        this.message = res.message;
        this.search();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not cancel flight.';
      }
    });
  }

  deleteFlight(flight: FlightResponse): void {
    if (!confirm(`Delete flight ${flight.flightNumber}? This cannot be undone.`)) return;

    this.flightService.deleteFlight(flight.id).subscribe({
      next: (res) => {
        this.message = res.message;
        this.search();
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not delete flight.';
      }
    });
  }

  isPassenger(): boolean {
    return this.authService.getRole() === 'PASSENGER';
  }

  isStaff(): boolean {
    return this.authService.getRole() === 'STAFF';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  canManageSeats(flight: FlightResponse): boolean {
    return !flight.isCancelled;
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

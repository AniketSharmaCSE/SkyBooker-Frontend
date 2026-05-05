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
    this.flightService.searchFlights(
      this.origin || undefined,
      this.destination || undefined,
      this.date || undefined
    ).subscribe({
      next: (data) => {
        this.flights = data;
        this.loading = false;
      },
      error: () => {
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

  isPassenger(): boolean {
    return this.authService.getRole() === 'PASSENGER';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SeatService } from '../../../core/services/seat.service';
import { FlightService } from '../../../core/services/flight.service';
import { FlightResponse } from '../../../core/models/flight.model';

@Component({
  selector: 'app-generate-seats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-seats.component.html',
  styleUrl: './generate-seats.component.scss'
})
export class GenerateSeatsComponent implements OnInit {
  flightId: string | number = '';
  businessSeats: number | null = null;
  premiumEconomySeats: number | null = null;
  economySeats: number | null = null;
  blockedSeatsInput = '';
  message = '';
  error = '';
  loading = false;
  flightsLoading = false;
  availableFlights: FlightResponse[] = [];

  constructor(
    private seatService: SeatService,
    private flightService: FlightService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  get isFlightIdValid(): boolean {
    if (this.flightId == null || this.flightId === '') return false;
    return this.flightId.toString().trim().length > 0;
  }

  loadFlights(): void {
    this.flightsLoading = true;
    this.flightService.searchFlights().subscribe({
      next: (flights) => {
        this.availableFlights = flights;
        this.flightsLoading = false;
      },
      error: () => {
        this.error = 'Could not load available flights.';
        this.flightsLoading = false;
      }
    });
  }

  generate(): void {
    const flightIdStr = this.flightId != null ? this.flightId.toString().trim() : '';
    if (!flightIdStr) return;
    if (!this.isFlightIdValid) {
      this.message = '';
      this.error = 'Enter a valid Flight ID.';
      return;
    }

    this.message = '';
    this.error = '';
    this.loading = true;

    const blockedSeats = this.blockedSeatsInput
      ? this.blockedSeatsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : undefined;

    this.seatService.generateSeats({
      flightId: flightIdStr,
      businessSeats: this.businessSeats ?? undefined,
      premiumEconomySeats: this.premiumEconomySeats ?? undefined,
      economySeats: this.economySeats ?? undefined,
      blockedSeats: blockedSeats
    }).subscribe({
      next: (res) => {
        this.message = res.message || 'Seats generated successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/booking', flightIdStr]);
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to generate seats.';
        this.loading = false;
      }
    });
  }

  viewMap(): void {
    const flightIdStr = this.flightId != null ? this.flightId.toString().trim() : '';
    if (!flightIdStr) return;
    this.router.navigate(['/booking', flightIdStr]);
  }

  chooseFlight(flight: FlightResponse): void {
    this.flightId = String(flight.id);
    this.message = '';
    this.error = '';
  }

  formatFlightLabel(flight: FlightResponse): string {
    const departure = new Date(flight.departureTime).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${flight.flightNumber} | ID ${flight.id} | ${flight.origin} -> ${flight.destination} | ${departure}`;
  }
}

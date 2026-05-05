import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SeatService } from '../../../core/services/seat.service';

@Component({
  selector: 'app-generate-seats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-seats.component.html',
  styleUrl: './generate-seats.component.scss'
})
export class GenerateSeatsComponent {
  flightId: string | number = '';
  businessSeats: number | null = null;
  premiumEconomySeats: number | null = null;
  economySeats: number | null = null;
  blockedSeatsInput: string = ''; // comma separated string
  message = '';
  error = '';
  loading = false;

  constructor(private seatService: SeatService, private router: Router) {}

  get isFlightIdValid(): boolean {
    if (this.flightId == null || this.flightId === '') return false;
    return this.flightId.toString().trim().length > 0;
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

    // Parse blocked seats from input
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
        // Navigate to manage seats after a short delay
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
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../core/services/flight.service';
import { SeatService } from '../../core/services/seat.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { FlightResponse } from '../../core/models/flight.model';
import { SeatResponse } from '../../core/models/seat.model';
import { getAirlineName, formatFlightId, getCityCode } from '../../core/utils/display.utils';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  flightId: string = '';
  flight: FlightResponse | null = null;
  seats: SeatResponse[] = [];

  // Multi-seat selection
  selectedSeats: SeatResponse[] = [];

  suggestedSeatNumbers: string[] = [];
  suggestionReasoning = '';
  loading = true;
  booking = false;
  bookingSuccess = false;
  pnrs: string[] = [];   // one PNR per booked seat
  error = '';

  // Seat map layout
  columns = ['A', 'B', 'C', 'D', 'E', 'F'];
  rows: number[] = [];

  getCityCode = getCityCode;
  formatFlightId = formatFlightId;
  getAirlineName = getAirlineName;

  // Price for a single seat: Base × Cabin Multiplier × Seat Multiplier
  getSeatPrice(seat: SeatResponse): number {
    if (!this.flight) return 0;

    let cabinMultiplier = 1.0;
    const cabin = (seat.cabinClass || '').toLowerCase();
    if (cabin.includes('business')) cabinMultiplier = 3.2;
    else if (cabin.includes('premium')) cabinMultiplier = 1.6;

    let seatMultiplier = 1.0;
    const seatType = (seat.seatType || '').toLowerCase();
    if (seatType === 'window') seatMultiplier = 1.08;
    else if (seatType === 'aisle') seatMultiplier = 1.05;
    else if (seatType === 'middle') seatMultiplier = 0.95;

    return this.flight.price * cabinMultiplier * seatMultiplier;
  }

  // Sum of prices for all selected seats
  getTotalPrice(): number {
    return this.selectedSeats.reduce((sum, s) => sum + this.getSeatPrice(s), 0);
  }

  getCabinClassKey(seat: SeatResponse): string {
    return (seat.cabinClass || 'Economy').replace(/\s+/g, '-').toLowerCase();
  }

  isSelected(seat: SeatResponse): boolean {
    return this.selectedSeats.some(s => s.seatNumber === seat.seatNumber);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private seatService: SeatService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.flightId = this.route.snapshot.paramMap.get('flightId') || '';
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.flightService.getFlightById(this.flightId).subscribe({
      next: f => {
        this.flight = f;
        this.loadSeats();
      },
      error: () => {
        this.error = 'Flight not found.';
        this.loading = false;
      }
    });
  }

  loadSeats(): void {
    this.seatService.getSeatMap(this.flightId).subscribe({
      next: seats => {
        this.seats = seats;
        const maxRow = Math.max(...seats.map(s => s.row), 0);
        this.rows = Array.from({ length: maxRow }, (_, i) => i + 1);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getSeat(row: number, col: string): SeatResponse | undefined {
    return this.seats.find(s => s.row === row && s.column === col);
  }

  isStaff(): boolean {
    return this.authService.getRole() === 'STAFF';
  }

  getSeatStatus(seat: SeatResponse | undefined): string {
    if (!seat) return 'empty';
    if (this.isSelected(seat)) return 'selected';
    if (seat.status?.toLowerCase() === 'booked') return 'booked';
    if (seat.status?.toLowerCase() === 'blocked') return 'blocked';
    if (this.suggestedSeatNumbers.includes(seat.seatNumber)) return 'suggested';
    return 'available';
  }

  // Toggle seat in/out of selection
  selectSeat(seat: SeatResponse | undefined): void {
    if (!seat) return;
    if (!this.isStaff() && seat.status?.toLowerCase() === 'booked') return;
    if (!this.isStaff() && seat.status?.toLowerCase() === 'blocked') return;
    
    // Staff can select any seat that isn't booked to block/unblock it
    if (this.isStaff() && seat.status?.toLowerCase() === 'booked') return;

    const idx = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);
    if (idx >= 0) {
      this.selectedSeats.splice(idx, 1);
    } else {
      this.selectedSeats.push(seat);
    }
    this.error = '';
  }

  toggleBlockSeats(): void {
    if (!this.selectedSeats.length) return;
    this.loading = true;
    this.error = '';
    this.processToggleBlock(0);
  }

  private processToggleBlock(index: number): void {
    if (index >= this.selectedSeats.length) {
      this.selectedSeats = [];
      this.loadSeats();
      return;
    }

    const seat = this.selectedSeats[index];
    this.seatService.toggleBlock(this.flightId, seat.seatNumber).subscribe({
      next: () => this.processToggleBlock(index + 1),
      error: (err) => {
        this.error = `Error toggling block for ${seat.seatNumber}: ${err.error?.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }

  removeSelectedSeat(seat: SeatResponse): void {
    this.selectedSeats = this.selectedSeats.filter(s => s.seatNumber !== seat.seatNumber);
  }

  // Up to 10 available suggested seats
  getSuggestion(): void {
    this.seatService.suggestSeat(this.flightId).subscribe({
      next: res => {
        this.suggestedSeatNumbers = res.suggestedSeats
          .filter(s => s.status?.toLowerCase() !== 'booked')
          .slice(0, 10)
          .map(s => s.seatNumber);
        this.suggestionReasoning = res.reasoning;
      },
      error: () => {
        this.error = 'Could not get seat suggestions.';
      }
    });
  }

  // Book each selected seat sequentially
  confirmBooking(): void {
    if (!this.selectedSeats.length) return;
    this.booking = true;
    this.error = '';
    this.pnrs = [];
    this.bookSeatsSequentially(0);
  }

  private bookSeatsSequentially(index: number): void {
    if (index >= this.selectedSeats.length) {
      this.booking = false;
      this.bookingSuccess = true;
      return;
    }

    const seat = this.selectedSeats[index];
    this.bookingService.createBooking({
      flightId: Number(this.flightId),   // backend DTO expects int
      seatNumber: seat.seatNumber
    }).subscribe({
      next: res => {
        this.pnrs.push(res.booking.pnr);
        this.bookSeatsSequentially(index + 1);
      },
      error: err => {
        this.booking = false;
        this.error = `Seat ${seat.seatNumber}: ` + (err.error?.message || 'Booking failed.');
      }
    });
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // SVG dimensions
  get seatWidth(): number { return 38; }
  get seatHeight(): number { return 34; }
  get seatGap(): number { return 6; }
  get aisleWidth(): number { return 30; }
  get rowLabelWidth(): number { return 30; }
  get topPadding(): number { return 80; }

  getSeatX(col: string): number {
    const colIndex = this.columns.indexOf(col);
    const baseX = this.rowLabelWidth + colIndex * (this.seatWidth + this.seatGap);
    if (colIndex >= 3) return baseX + this.aisleWidth;
    return baseX;
  }

  getSeatY(row: number): number {
    return this.topPadding + (row - 1) * (this.seatHeight + this.seatGap);
  }

  get svgWidth(): number {
    return this.rowLabelWidth + 6 * (this.seatWidth + this.seatGap) + this.aisleWidth + 20;
  }

  get svgHeight(): number {
    return this.topPadding + this.rows.length * (this.seatHeight + this.seatGap) + 20;
  }
}

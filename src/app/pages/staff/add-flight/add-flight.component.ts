import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../core/services/flight.service';
import { AddFlightRequest } from '../../../core/models/flight.model';
import { CITIES } from '../../../core/utils/display.utils';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-flight.component.html',
  styleUrl: './add-flight.component.scss'
})
export class AddFlightComponent {
  cities = CITIES;
  form: AddFlightRequest = {
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: 0,
    totalSeats: 0,
    airline: '',
    comfortPremium: 100
  };
  message = '';
  error = '';
  loading = false;

  constructor(private flightService: FlightService) {}

  submit(): void {
    this.message = '';
    this.error = '';
    this.loading = true;

    this.flightService.addFlight(this.form).subscribe({
      next: (res) => {
        this.message = `Flight ${res.flightNumber} added successfully! (ID: ${res.id})`;
        this.loading = false;
        this.form = { flightNumber: '', origin: '', destination: '', departureTime: '', arrivalTime: '', price: 0, totalSeats: 0, airline: '', comfortPremium: 100 };
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add flight.';
        this.loading = false;
      }
    });
  }
}

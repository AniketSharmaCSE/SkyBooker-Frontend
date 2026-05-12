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
    const validationError = this.validateForm();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.loading = true;
    const payload: AddFlightRequest = {
      ...this.form,
      flightNumber: this.form.flightNumber.trim(),
      origin: this.form.origin.trim(),
      destination: this.form.destination.trim(),
      airline: this.form.airline.trim() || 'SkyBooker Express',
      departureTime: new Date(this.form.departureTime).toISOString(),
      arrivalTime: new Date(this.form.arrivalTime).toISOString(),
      price: Number(this.form.price),
      totalSeats: Number(this.form.totalSeats),
      comfortPremium: Number(this.form.comfortPremium)
    };

    this.flightService.addFlight(payload).subscribe({
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

  private validateForm(): string {
    const requiredFields = [
      this.form.flightNumber,
      this.form.origin,
      this.form.destination,
      this.form.departureTime,
      this.form.arrivalTime
    ];
    if (requiredFields.some(value => !value?.toString().trim())) {
      return 'Please fill all required flight details.';
    }
    if (this.form.origin.trim().toLowerCase() === this.form.destination.trim().toLowerCase()) {
      return 'Origin and destination cannot be the same.';
    }

    const departure = new Date(this.form.departureTime);
    const arrival = new Date(this.form.arrivalTime);
    if (Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime())) {
      return 'Enter valid departure and arrival times.';
    }
    if (departure <= new Date()) {
      return 'Departure time must be in the future.';
    }
    if (departure >= arrival) {
      return 'Departure time must be before arrival time.';
    }
    if (Number(this.form.price) <= 0) {
      return 'Price must be greater than 0.';
    }
    if (!Number.isInteger(Number(this.form.totalSeats)) || Number(this.form.totalSeats) <= 0) {
      return 'Total seats must be a whole number greater than 0.';
    }
    if (Number(this.form.comfortPremium) < 0) {
      return 'Comfort premium cannot be negative.';
    }

    return '';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerService } from '../../../core/services/passenger.service';
import { PassengerProfileResponse } from '../../../core/models/passenger.model';
import { formatPassengerId } from '../../../core/utils/display.utils';

@Component({
  selector: 'app-passengers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passengers.component.html',
  styleUrl: './passengers.component.scss'
})
export class PassengersComponent implements OnInit {
  passengers: PassengerProfileResponse[] = [];
  totalCount = 0;
  loading = true;
  selectedPassenger: PassengerProfileResponse | null = null;

  formatPassengerId = formatPassengerId;

  constructor(private passengerService: PassengerService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.passengerService.getAllPassengers().subscribe({
      next: data => {
        this.passengers = data.passengers;
        this.totalCount = data.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  viewDetails(userId: number): void {
    this.passengerService.getByUserId(userId).subscribe({
      next: p => this.selectedPassenger = p,
      error: () => {}
    });
  }

  closeDetails(): void {
    this.selectedPassenger = null;
  }
}

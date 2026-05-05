import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CITIES } from '../../core/utils/display.utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  origin = '';
  destination = '';
  date = '';

  cities = CITIES;

  destinations = CITIES.slice(0, 6); // Top 6 destinations

  constructor(private router: Router) {}

  searchFlights(): void {
    this.router.navigate(['/flights'], {
      queryParams: {
        origin: this.origin || undefined,
        destination: this.destination || undefined,
        date: this.date || undefined
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenerateSeatsRequest, SeatResponse, SeatSuggestionResponse } from '../models/seat.model';

@Injectable({ providedIn: 'root' })
export class SeatService {
  private readonly API = '/seats';

  constructor(private http: HttpClient) {}

  getSeatMap(flightId: number | string): Observable<SeatResponse[]> {
    return this.http.get<SeatResponse[]>(`${this.API}/${flightId}`);
  }

  generateSeats(request: GenerateSeatsRequest): Observable<any> {
    return this.http.post(`${this.API}/generate`, request);
  }

  suggestSeat(flightId: number | string, preference?: string): Observable<SeatSuggestionResponse> {
    const url = `/bookings/suggest/${flightId}`;
    return this.http.get<SeatSuggestionResponse>(url, {
      params: preference ? { preference } : {}
    });
  }

  toggleBlock(flightId: string, seatNumber: string): Observable<any> {
    return this.http.post(`${this.API}/toggle-block`, { flightId, seatNumber });
  }
}

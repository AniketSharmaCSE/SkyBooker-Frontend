import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateBookingRequest, BookingResponse, AllBookingsResponse } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly API = '/bookings';

  constructor(private http: HttpClient) {}

  createBooking(req: CreateBookingRequest): Observable<{ message: string; booking: BookingResponse }> {
    return this.http.post<{ message: string; booking: BookingResponse }>(this.API, req);
  }

  getMyBookings(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.API}/my`);
  }

  getByPnr(pnr: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.API}/${pnr}`);
  }

  cancelBooking(pnr: string): Observable<{ message: string; booking: BookingResponse }> {
    return this.http.put<{ message: string; booking: BookingResponse }>(`${this.API}/${pnr}/cancel`, {});
  }

  getAllBookings(flightId?: number): Observable<AllBookingsResponse> {
    let params = new HttpParams();
    if (flightId) params = params.set('flightId', flightId.toString());
    return this.http.get<AllBookingsResponse>(`${this.API}/all`, { params });
  }
}

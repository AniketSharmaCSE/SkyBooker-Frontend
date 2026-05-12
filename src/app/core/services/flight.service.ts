import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlightResponse, AddFlightRequest } from '../models/flight.model';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private readonly API = '/flights';

  constructor(private http: HttpClient) {}

  searchFlights(origin?: string, destination?: string, date?: string): Observable<FlightResponse[]> {
    let params = new HttpParams();
    if (origin) params = params.set('origin', origin);
    if (destination) params = params.set('destination', destination);
    if (date) params = params.set('date', date);
    return this.http.get<FlightResponse[]>(this.API, { params });
  }

  getAllFlights(origin?: string, destination?: string, date?: string): Observable<FlightResponse[]> {
    let params = new HttpParams();
    if (origin) params = params.set('origin', origin);
    if (destination) params = params.set('destination', destination);
    if (date) params = params.set('date', date);
    return this.http.get<FlightResponse[]>(`${this.API}/all`, { params });
  }

  getFlightById(id: string): Observable<FlightResponse> {
    return this.http.get<FlightResponse>(`${this.API}/${id}`);
  }

  addFlight(req: AddFlightRequest): Observable<FlightResponse> {
    return this.http.post<FlightResponse>(this.API, req);
  }

  cancelFlight(id: number): Observable<{ message: string; flight: FlightResponse }> {
    return this.http.put<{ message: string; flight: FlightResponse }>(`${this.API}/${id}/cancel`, {});
  }

  deleteFlight(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}/${id}`);
  }
}

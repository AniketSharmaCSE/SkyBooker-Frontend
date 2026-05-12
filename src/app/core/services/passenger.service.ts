import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpsertProfileRequest, PassengerProfileResponse, AllPassengersResponse } from '../models/passenger.model';

@Injectable({ providedIn: 'root' })
export class PassengerService {
  private readonly API = '/passengers';

  constructor(private http: HttpClient) {}

  upsertProfile(req: UpsertProfileRequest): Observable<{ message: string; profile: PassengerProfileResponse }> {
    return this.http.post<{ message: string; profile: PassengerProfileResponse }>(`${this.API}/profile`, req);
  }

  getMyProfile(): Observable<PassengerProfileResponse> {
    return this.http.get<PassengerProfileResponse>(`${this.API}/profile`);
  }

  getAllPassengers(): Observable<AllPassengersResponse> {
    return this.http.get<AllPassengersResponse>(`${this.API}/all`);
  }

  getByUserId(userId: number): Observable<PassengerProfileResponse> {
    return this.http.get<PassengerProfileResponse>(`${this.API}/${userId}`);
  }
}

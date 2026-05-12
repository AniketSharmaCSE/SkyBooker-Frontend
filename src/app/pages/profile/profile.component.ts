import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PassengerService } from '../../core/services/passenger.service';
import { PassengerProfileResponse, UpsertProfileRequest } from '../../core/models/passenger.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: PassengerProfileResponse | null = null;
  loading = true;
  saving = false;
  isEditing = false;
  message = '';
  error = '';

  form: UpsertProfileRequest = {
    phoneNumber: '',
    dateOfBirth: '',
    passportNumber: '',
    nationality: ''
  };

  constructor(
    private passengerService: PassengerService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.passengerService.getMyProfile().subscribe({
      next: p => {
        this.profile = p;
        this.form = {
          phoneNumber: p.phoneNumber || '',
          dateOfBirth: p.dateOfBirth || '',
          passportNumber: p.passportNumber || '',
          nationality: p.nationality || ''
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.isEditing = true; // No profile yet, show form
      }
    });
  }

  saveProfile(): void {
    this.saving = true;
    this.error = '';
    this.message = '';

    this.passengerService.upsertProfile(this.form).subscribe({
      next: res => {
        this.profile = res.profile;
        this.message = res.message;
        this.saving = false;
        this.isEditing = false;
      },
      error: err => {
        this.saving = false;
        this.error = err.error?.message || 'Failed to save profile.';
      }
    });
  }
}

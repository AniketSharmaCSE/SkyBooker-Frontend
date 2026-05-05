import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'flights',
    loadComponent: () => import('./pages/flights/flights.component').then(m => m.FlightsComponent)
  },
  {
    path: 'booking/:flightId',
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent),
    canActivate: [roleGuard(['PASSENGER', 'STAFF'])]
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
    canActivate: [roleGuard('PASSENGER')]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [roleGuard('PASSENGER')]
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [roleGuard('PASSENGER')]
  },
  {
    path: 'staff',
    canActivate: [roleGuard('STAFF')],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/staff/dashboard/staff-dashboard.component').then(m => m.StaffDashboardComponent)
      },
      {
        path: 'add-flight',
        loadComponent: () => import('./pages/staff/add-flight/add-flight.component').then(m => m.AddFlightComponent)
      },
      {
        path: 'generate-seats',
        loadComponent: () => import('./pages/staff/generate-seats/generate-seats.component').then(m => m.GenerateSeatsComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./pages/staff/manage-bookings/manage-bookings.component').then(m => m.ManageBookingsComponent)
      },
      {
        path: 'passengers',
        loadComponent: () => import('./pages/staff/passengers/passengers.component').then(m => m.PassengersComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

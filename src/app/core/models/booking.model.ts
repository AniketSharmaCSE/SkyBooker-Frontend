export interface CreateBookingRequest {
  flightId: number;
  seatNumber: string;
}

export interface BookingResponse {
  id: number;
  pnr: string;
  passengerId: number;
  flightId: number;
  seatNumber: string;
  status: string;
  bookedAt: string;
  cancelledAt: string | null;
}

export interface AllBookingsResponse {
  bookings: BookingResponse[];
  totalCount: number;
}

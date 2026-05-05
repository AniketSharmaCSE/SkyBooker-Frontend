export interface AddFlightRequest {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  airline: string;
  comfortPremium: number;
}

export interface FlightResponse {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  travelDuration: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  isAvailable: boolean;
  airline: string;
  comfortPremium: number;
}

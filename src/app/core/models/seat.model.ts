export interface SeatResponse {
  id: number;
  flightId: string;
  seatNumber: string;
  row: number;
  column: string;
  status: string;
  cabinClass: string;
  classMultiplier: number;
  seatType: string;
  comfortScore: number;
  priceModifier: number;
}

export interface SeatSuggestionResponse {
  suggestedSeats: SeatResponse[];
  reasoning: string;
}

export interface GenerateSeatsRequest {
  flightId: string;
  businessSeats?: number;
  premiumEconomySeats?: number;
  economySeats?: number;
  blockedSeats?: string[];
}

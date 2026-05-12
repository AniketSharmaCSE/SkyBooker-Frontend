export interface UpsertProfileRequest {
  phoneNumber: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
}

export interface PassengerProfileResponse {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllPassengersResponse {
  passengers: PassengerProfileResponse[];
  totalCount: number;
}

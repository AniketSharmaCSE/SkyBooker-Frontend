export const CITIES = [
  { name: 'Lucknow', code: 'LKO' },
  { name: 'New Delhi', code: 'DEL' },
  { name: 'Mumbai', code: 'BOM' },
  { name: 'Bangalore', code: 'BLR' },
  { name: 'Hyderabad', code: 'HYD' },
  { name: 'Chennai', code: 'MAA' },
  { name: 'Kolkata', code: 'CCU' },
  { name: 'Pune', code: 'PNQ' },
  { name: 'Ahmedabad', code: 'AMD' },
  { name: 'Jaipur', code: 'JAI' },
  { name: 'Dubai', code: 'DXB' },
  { name: 'New York', code: 'JFK' },
  { name: 'London', code: 'LHR' },
  { name: 'Singapore', code: 'SIN' }
];

export function getCityCode(cityName: string): string {
  if (!cityName) return '';
  const city = CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase() || c.code.toLowerCase() === cityName.toLowerCase());
  return city ? city.code : cityName.substring(0, 3).toUpperCase();
}

export function formatFlightId(id: number | string): string {
  if (!id && id !== 0) return '';
  return id.toString();
}

export function getAirlineName(id: number): string {
  if (!id) return 'Airline';
  const airlines = ['Air India', 'Emirates', 'SkyBooker Express', 'IndiGo', 'Vistara', 'Qatar Airways', 'SpiceJet'];
  return airlines[id % airlines.length];
}

export function formatPassengerId(id: number): string {
  if (!id) return '';
  return 'PAX' + id.toString().padStart(4, '0');
}

export type DepartureIATACode = "SEA" | "YYZ" | "YYT" | "ANC" | "LAX";
export type ArrivalIATACode =  "MIT" | "LEW" | "GDN" | "KRK" | "PPX";
export type WeightUnit = "kg" | "lb";

export interface Flight{
  flightId: number;
  flightNumber: number;
  departureAirportIATACode: DepartureIATACode;
  arrivalAirportIATACode: ArrivalIATACode;
  departureDate: string;
}

export const EMPTY_FLIGHT: Flight = {
  flightId: -1,
  flightNumber: -1,
  departureAirportIATACode: "SEA",
  arrivalAirportIATACode: "GDN",
  departureDate: ''
}

export interface FlightLoad{
  id: number;
  weight: number;
  weightUnit: WeightUnit;
  pieces: number;
}

export interface FlightCargo extends FlightLoad{}

export interface FlightBaggage extends FlightLoad{}

export interface FlightData{
  flightId: number;
  baggage: FlightBaggage[];
  cargo: FlightCargo[];
}

export function isFlight(value: Object): boolean{
  return 'flightNumber' in value;
}

export function isFlightLoad(value: Object): boolean{
  return "weight" in value;
}

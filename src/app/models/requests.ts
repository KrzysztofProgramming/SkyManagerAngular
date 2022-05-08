export interface DateRequest{
  startDate: Date;
  endDate: Date;
}

export interface FlightNumberStatsRequest extends DateRequest{
  flightNumber: number;
}

export interface IATACodeStatsRequest extends DateRequest{
  code: string;
}
import { environment } from './../../environments/environment';
import { IATACodeStatsRequest } from './../models/requests';
import { IATACodeStats } from './../models/responses';
import { FlightData } from './../models/models';
import { Flight } from 'src/app/models/models';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FlightNumberStatsRequest } from '../models/requests';
import { FlightNumberStats } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public uploadFlights(flights: Flight[]): Observable<unknown>{
    return this.http.put(`${this.url}/uploadFlights`, flights);
  }

  public uploadLoads(loads: FlightData[]): Observable<unknown>{
    return this.http.put(`${this.url}/uploadLoads`, loads);
  }

  public getFlightNumberStats(flightNumber: number, startDate: Date, endDate: Date): Observable<FlightNumberStats>{
    console.log(environment.apiUrl);
    let request: FlightNumberStatsRequest = {
      flightNumber: flightNumber,
      endDate: endDate,
      startDate: startDate
    };
    return this.http.post<FlightNumberStats>(`${this.url}/flightNumberStats`, request);
  }

  public getIATACodeStats(code: string, startDate: Date, endDate: Date): Observable<IATACodeStats>{
    let request: IATACodeStatsRequest = {
      code: code,
      endDate: endDate,
      startDate: startDate
    };
    return this.http.post<IATACodeStats>(`${this.url}/IATACodeStats`, request);
  }
}

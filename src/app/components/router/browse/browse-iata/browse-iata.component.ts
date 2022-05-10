import { IATACodeStats, FlightNumberStats } from './../../../../models/responses';
import { FormControl } from '@angular/forms';
import { FiltersModel } from './../../../utils/filters/filters.component';
import { HttpService } from './../../../../services/http.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { finalize, interval, Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

export type mode = "iata" | "number";

export interface BrowserParams extends Params{
  dateStart?: string,
  dateEnd?: string,
  iata?: string,
  number?: number
}

@Component({
  selector: 'app-browse-iata',
  templateUrl: './browse-iata.component.html',
  styleUrls: ['./browse-iata.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseIataComponent implements OnInit, OnDestroy {
    
  public filtersControl = new FormControl({});
  public response?: IATACodeStats | FlightNumberStats;
  public waitingForResponse: boolean = false;
  public subscriptions: Subscription[] = [];
  public mode: mode = "iata";

  public get model(): FiltersModel{
    return this.filtersControl.value;
  }

  public get iataResponse(){
    return this.response as IATACodeStats;
  }

  public get numberResponse(){
    return this.response as FlightNumberStats;
  }

  constructor(private httpService: HttpService, private cd: ChangeDetectorRef, private route: ActivatedRoute,
     private router: Router) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.url.subscribe(value=>{
        this.mode = value[0].path as mode;
      }),
      this.route.queryParams.subscribe(this.onParamsChanged.bind(this))
    );
    this.readDatesFromStorage();
  }

  public onParamsChanged(params: Params){
    let model: FiltersModel = {};
    model.codeOrNumber = this.mode === 'iata' && params['iata'] ? params['iata'] :
                         this.mode === 'number' && params['number'] ? +params['number'] : undefined;
    model.dateStart = params['dateStart'] ? new Date(Date.parse(params['dateStart'])) : undefined;
    model.dateEnd = params['dateEnd'] ? new Date(Date.parse(params['dateEnd'])) : undefined;
    this.filtersControl.setValue(model);
    this.response = undefined;
    this.cd.markForCheck();
    setTimeout(() => {
      this.sendRequest();
      this.cd.markForCheck();
    }, 0);

  }

  public navigateToParams(){
    let generatedParams: BrowserParams = {};
    generatedParams.dateEnd = this.model.dateEnd?.toISOString();
    generatedParams.dateStart = this.model.dateStart?.toISOString();
    if(this.mode === 'iata') generatedParams.iata = this.model.codeOrNumber as string;
    else generatedParams.number = this.model.codeOrNumber as number;

    let params = Object.assign(Object.assign({},Object.assign(this.route.snapshot.params)), generatedParams);
    this.router.navigate(['.'], {relativeTo: this.route, queryParams: params, queryParamsHandling: 'merge'});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public sendRequest(){
    if(this.filtersControl.invalid) return;
    this.waitingForResponse = true;
    this.cd.markForCheck();
    this.saveDatesToStorage();
    switch(this.mode){
      case "iata":  this.httpService.getIATACodeStats(this.model.codeOrNumber as string, this.model.dateStart!,
          this.model.dateEnd!)
          .pipe(finalize(()=>{this.waitingForResponse = false; this.cd.markForCheck()}))
          .subscribe(response=>{
            this.response = response;
          })
          break;
      case "number": this.httpService.getFlightNumberStats(this.model.codeOrNumber as number, this.model.dateStart!,
          this.model.dateEnd!)
          .pipe(finalize(()=>{this.waitingForResponse = false; this.cd.markForCheck()}))
          .subscribe(response=>{
            this.response = response;
          })
    }
  }

  public saveDatesToStorage(){
    localStorage.setItem("dateStart", this.model.dateStart!.toISOString());
    localStorage.setItem("dateEnd", this.model.dateEnd!.toISOString());
  }

  public readDatesFromStorage(){
    let model = this.model;
    let startString = localStorage.getItem("dateStart");
    let endString = localStorage.getItem("dateEnd");
    if(startString)
      model.dateStart = new Date(Date.parse(startString));
    if(endString)
      model.dateEnd = new Date(Date.parse(endString));
    this.filtersControl.setValue(model);
  }

}

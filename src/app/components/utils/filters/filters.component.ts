import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { mode } from '../../router/browse/browse-iata/browse-iata.component';

export interface FiltersModel{
  dateStart?: Date,
  dateEnd?: Date,
  codeOrNumber?: string | number;
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FiltersComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FiltersComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, ControlValueAccessor, OnDestroy, Validator {

  @Input() mode: mode = "iata";
  @Output() submit: EventEmitter<void> = new EventEmitter();


  public model: FiltersModel = {};

  public form = this.fb.group({
    dateStart: [undefined, Validators.required],
    dateEnd: [undefined, Validators.required],
    codeOrNumber: [0, Validators.required]
  });

  public onChangeFn: any = ()=>{};
  public onToucheFn: any = ()=>{};
  private subscriptions: Subscription[] = [];
  
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  validate(_control: AbstractControl): ValidationErrors | null {
    return this.form.invalid ? {invalid: true} : null;
  }

  public get dateStartControl(): AbstractControl{
    return this.form.get("dateStart")!;
  }

  public get dateEndControl(): AbstractControl{
    return this.form.get("dateEnd")!;
  }

  public get codeOrNumberControl(): AbstractControl{
    return this.form.get("codeOrNumber")!;
  }

  writeValue(obj: any): void {
    this.model = Object.assign({}, obj);
    this.dateStartControl.setValue(this.model.dateStart);
    this.dateEndControl.setValue(this.model.dateEnd);
    this.codeOrNumberControl.setValue(this.model.codeOrNumber);
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onToucheFn = fn;
  }

  public callOnTouche(){
    this.onToucheFn();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.form.valueChanges.pipe().subscribe(()=>this.callOnChange())
    )
  }

  public callOnChange(){
    this.onChangeFn(this.form.value);
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public trySubmit(){
    console.log("clicked");
    if(this.form.invalid) return;
    this.submit.emit();
  }

}

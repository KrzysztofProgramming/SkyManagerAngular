import { FlightLoad, isFlight, isFlightLoad } from './../../../models/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { Flight } from 'src/app/models/models';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent implements OnInit, OnDestroy {

  private _errorMessage: string = '';
  private _successMessage: string = '';
  public invalidJSON: boolean = false;
  private subscriptions: Subscription[] = [];
  public JSONControl: FormControl = new FormControl('');
  public model: any[] = [];

  public get errorMessage(): string{
    return this._errorMessage;
  }

  public set errorMessage(value: string){
    this.invalidJSON = true;
    this._successMessage = '';
    this._errorMessage = value;
    this.cd.markForCheck();
  }

  public get successMessage(): string{
    return this._successMessage;
  }

  public set successMessage(value: string){
    this.invalidJSON = false;
    this._errorMessage = '';
    this._successMessage = value;
    this.cd.markForCheck();
  }

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.JSONControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(this.onTextChange.bind(this))
    );
  }

  ngOnDestroy(): void{
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public onTextChange(json: string){
    if(json.length === 0 ){
      this.successMessage = '';
      return;
    }
    try{
      this.model = JSON.parse(json);
      if(!this.model.every((item: Object)=>{return isFlight(item) || isFlightLoad(item)})){
        this.errorMessage = "Wrong properties";
        return;
      }
      this.successMessage = "Valid JSON";
      console.log(this.model);
    }
    catch(e){
      this.errorMessage = "Wrong JSON format";
    }
  }

  public onFileChange(fileInput: HTMLInputElement){
    if(!fileInput.files ||  fileInput.files.length === 0) return;
    let file = fileInput.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = this.onFileLoaded(reader).bind(this);
  }

  public onFileLoaded(reader: FileReader){
    return (event: Event) =>{
      this.JSONControl.setValue(reader.result);
    }
  }

  public onReaderError(){
    this.errorMessage = "Zły typ pliku";
  }

}

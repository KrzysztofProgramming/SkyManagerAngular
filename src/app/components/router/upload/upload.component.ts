import { HttpService } from './../../../services/http.service';
import { isFlight, isFlightData } from './../../../models/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { identifierName } from '@angular/compiler';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent implements OnInit, OnDestroy {

  private _errorMessage: string = '';
  private _successMessage: string = '';
  public invalidJSON: boolean = false;
  private subscriptions: Subscription[] = [];
  public JSONControl: FormControl = new FormControl('');
  public model: any[] = [];
  public waitingForResponse: boolean = false;

  public get errorMessage(): string{
    return this._errorMessage;
  }

  public set errorMessage(value: string){
    this.invalidJSON = true;
    this.model = [];
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

  constructor(private cd: ChangeDetectorRef, private httpService: HttpService, private messages: MessageService) { }

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
      if(this.model.length === 0){
        this.errorMessage = "Empty array";
        return;
      }
      if(!this.model.every((item: Object)=>{return isFlight(item) || isFlightData(item)})){
        this.errorMessage = "Wrong properties";
        return;
      }
      this.successMessage = "Valid";
      console.log(this.model);
    }
    catch(e){
      this.errorMessage = "Wrong format";
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

  public uploadData(){
    if(this.model.length === 0) return; 
    this.waitingForResponse = true;
    this.cd.markForCheck();

    let resultActions = {
      next: this.onRequestSuccess.bind(this),
      error: this.onRequestFailed.bind(this),
      complete: ()=>{this.waitingForResponse = false; this.cd.markForCheck();}
    }

    if(isFlight(this.model[0]))
      this.httpService.uploadFlights(this.model).subscribe(resultActions)

    else if(isFlightData(this.model[0]))
      this.httpService.uploadLoads(this.model).subscribe(resultActions)
  }

  public onRequestSuccess(){
    this.JSONControl.setValue("");
    this.messages.add({severity: 'success', summary: "Success", detail: "Datas have been modified"});
  }

  public onRequestFailed(request: any){
    let info = request.error ? request.error : 'Check is data correct';
    this.messages.add({severity: 'error', summary: "Error", detail: info});
  }

}

import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { UploadComponent } from './components/router/upload/upload.component';
import { BrowseComponent } from './components/router/browse/browse.component';
import { ButtonDirective } from './directives/button.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowseIataComponent } from './components/router/browse/browse-iata/browse-iata.component';
import { FiltersComponent } from './components/utils/filters/filters.component';
import { CalendarModule } from 'primeng/calendar'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule } from '@angular/forms'
import {ToastModule} from 'primeng/toast';

import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    UploadComponent,
    BrowseComponent,
    ButtonDirective,
    BrowseIataComponent,
    FiltersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalendarModule,
    BrowserAnimationsModule,
    InputNumberModule,
    InputTextModule,
    FormsModule,
    ToastModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr_FR'}],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowseIataComponent } from './components/router/browse/browse-iata/browse-iata.component';
import { UploadComponent } from './components/router/upload/upload.component';
import { BrowseComponent } from './components/router/browse/browse.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'browse', component: BrowseComponent, children:[
    {path: 'iata', component: BrowseIataComponent},
    {path: 'number', component: BrowseIataComponent}
  ]},
  {path: 'upload', component: UploadComponent},
  {path: '', redirectTo: 'browse', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { UploadComponent } from './components/router/upload/upload.component';
import { BrowseComponent } from './components/router/browse/browse.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'browse', component: BrowseComponent},
  {path: 'upload', component: UploadComponent},
  {path: '', redirectTo: 'browse', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UploadComponent } from './components/upload/upload.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  { path: '', component: UploadComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: '' }
];

export const appConfig = {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes), HttpClientModule)
  ]
};
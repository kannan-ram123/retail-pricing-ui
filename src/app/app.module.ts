import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// standalone bootstrap component
import { AppComponent } from './app.component';

// standalone route components
import { UploadComponent } from './components/upload/upload.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  { path: '', component: UploadComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AppComponent // import standalone bootstrap component
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';

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

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
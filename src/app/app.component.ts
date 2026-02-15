import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// standalone components used by routes or shell
import { UploadComponent } from './components/upload/upload.component';
import { SearchComponent } from './components/search/search.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule, UploadComponent, SearchComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Retail Pricing UI';
}
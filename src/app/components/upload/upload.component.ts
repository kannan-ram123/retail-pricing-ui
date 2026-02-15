import { Component } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { Subscription } from "rxjs";
import { lastValueFrom } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-upload",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.css"] 
})
export class UploadComponent {
  file?: File;
  progress = 0;
  uploading = false;
  lastUploadId?: string;
  message?: string;
  sub?: Subscription;

  constructor(private api: ApiService) {}

  onFileChanged(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.file = input.files && input.files[0] ? input.files[0] : undefined;
  }

  upload() {
    if (!this.file) { this.message = "Select a file first."; return; }
    this.uploading = true;
    this.progress = 0;
    this.sub = this.api.uploadCsv(this.file).subscribe((evt: any) => {
      if (evt.type === "progress") {
        this.progress = evt.value;
      } else if (evt.type === "response") {
        const body = evt.body;
        this.lastUploadId = body?.BatchId ?? body?.batchId ?? body?.BatchId?.toString();
        this.message = "Upload completed. BatchId: " + this.lastUploadId;
        this.uploading = false;
        this.sub?.unsubscribe();
      }
    }, err => {
      this.message = "Upload failed: " + (err?.message || err.statusText || "unknown");
      this.uploading = false;
      this.sub?.unsubscribe();
    });
  }

  async downloadErrors() {
    if (!this.lastUploadId) { this.message = "No uploaded batch to download errors for."; return; }
    const blob = await lastValueFrom(this.api.downloadUploadErrors(this.lastUploadId));
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `upload_${this.lastUploadId}_errors.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
}

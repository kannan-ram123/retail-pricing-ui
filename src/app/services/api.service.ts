import { HttpClient, HttpEventType, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PricingRecord } from "../models/pricing-record";
import { UploadHistory } from "../models/upload-history";
import { lastValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
@Injectable({ providedIn: "root" })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  uploadCsv(file: File) {
    const fd = new FormData();
    fd.append("file", file, file.name);
    return this.http.post<any>(`${this.base}/pricing/upload`, fd, {
      reportProgress: true,
      observe: "events"
    }).pipe(
      map(evt => {
        if (evt.type === HttpEventType.UploadProgress && evt.total)
          return { type: "progress", value: Math.round(100 * evt.loaded / evt.total) };
        if (evt.type === HttpEventType.Response) return { type: "response", body: evt.body };
        return { type: "other" };
      })
    );
  }

  getUploadStatus(uploadId: string) {
    return this.http.get<UploadHistory>(`${this.base}/pricing/upload/${uploadId}`);
  }

  downloadUploadErrors(uploadId: string) {
    return this.http.get(`${this.base}/pricing/upload/${uploadId}/errors`, { responseType: "blob" });
  }

  searchPricing(params: { storeId?: number; sku?: string; fromDate?: string; toDate?: string; page?: number; pageSize?: number; }) {
    let p = new HttpParams();
    Object.keys(params).forEach(k => {
      const v = (params as any)[k];
      if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v));
    });
    return this.http.get<PricingRecord[]>(`${this.base}/pricing/search`, { params: p });
  }

  updatePrice(pricingRecordId: number, newPrice: number) {
    return this.http.put<PricingRecord>(`${this.base}/pricing/${pricingRecordId}`, { price: newPrice });
  }
}

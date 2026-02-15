import { Component } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { lastValueFrom } from 'rxjs'; 
import { ApiService } from '../../services/api.service'; 
import { PricingRecord } from '../../models/pricing-record';

@Component({
  selector: "app-search",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent {
  storeId?: number;
  sku?: string;
  fromDate?: string;
  toDate?: string;
  results: PricingRecord[] = [];
  loading = false;
  editingId: number | null = null;
  editPrice = 0;

  constructor(private api: ApiService) {}

  async search() {
    this.loading = true;
    try {
      const params: any = {};
      if (this.storeId) params.storeId = this.storeId;
      if (this.sku) params.sku = this.sku;
      if (this.fromDate) params.fromDate = this.fromDate;
      if (this.toDate) params.toDate = this.toDate;
      this.results = await lastValueFrom(this.api.searchPricing(params));
    } finally {
      this.loading = false;
    }
  }

  startEdit(r: PricingRecord) {
    this.editingId = r.pricingRecordId;
    this.editPrice = r.price;
  }

  async saveEdit(r: PricingRecord) {
    if (this.editingId == null) return;
    try {
      const updated = await lastValueFrom(this.api.updatePrice(this.editingId, this.editPrice));
      const idx = this.results.findIndex(x => x.pricingRecordId === this.editingId);
      if (idx >= 0) this.results[idx] = updated;
      this.editingId = null;
    } catch (err: any) {
      alert("Save failed: " + (err?.message || "unknown"));
    }
  }

  cancelEdit() {
    this.editingId = null;
  }
}

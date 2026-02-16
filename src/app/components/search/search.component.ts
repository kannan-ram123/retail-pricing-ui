import { Component, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { lastValueFrom } from 'rxjs'; 
import { ApiService } from '../../services/api.service'; 
import { PricingRecord } from '../../models/pricing-record';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

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

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  @ViewChild('skuRef') skuRef!: ElementRef<HTMLInputElement>;
  @ViewChild('storeRef') storeRef!: ElementRef<HTMLInputElement>;
  @ViewChild('fromRef') fromRef!: ElementRef<HTMLInputElement>;
  @ViewChild('toRef') toRef!: ElementRef<HTMLInputElement>;

  async search(values?: { storeId?: number; sku?: string; fromDate?: string; toDate?: string }) {
    // Read values from the DOM as a fallback to ensure latest typed input is captured
    const storeEl = this.storeRef?.nativeElement;
    const skuEl = this.skuRef?.nativeElement;
    const fromEl = this.fromRef?.nativeElement;
    const toEl = this.toRef?.nativeElement;

    const storeId = (values?.storeId ?? this.storeId) ?? (storeEl && storeEl.value ? Number(storeEl.value) : undefined);
    const sku = (values?.sku ?? this.sku) ?? (skuEl?.value ?? undefined);
    const fromDate = (values?.fromDate ?? this.fromDate) ?? (fromEl?.value ?? undefined);
    const toDate = (values?.toDate ?? this.toDate) ?? (toEl?.value ?? undefined);
    console.log('Search clicked', { storeId, sku, fromDate, toDate });
    this.loading = true;
    try {
      const params: any = {};
      if (storeId) params.storeId = storeId;
      if (sku) params.sku = sku;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      this.results = await lastValueFrom(this.api.searchPricing(params));
      console.log('Search results received', { count: this.results?.length, sample: this.results?.slice?.(0,3) });
    } finally {
      this.loading = false;
      try { this.cdr.markForCheck(); } catch {}
    }
  }

  submitFromButton(f: NgForm) {
    try {
      const active = document.activeElement as HTMLElement | null;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.getAttribute('contenteditable') === 'true')) {
        // dispatch an input event so Angular updates ngModel synchronously
        active.dispatchEvent(new Event('input', { bubbles: true }));
        active.blur();
      }
    } catch {}
    // ensure change detection runs and then call search
    try { this.cdr.detectChanges(); } catch {}
    this.search(f.value);
    try { this.cdr.markForCheck(); } catch {}
  }

  submitStartEdit(r: PricingRecord) {
    try { this.cdr.detectChanges(); } catch {}
    this.startEdit(r);
    try { this.cdr.markForCheck(); } catch {}
  }

  submitSaveEdit(r: PricingRecord) {
    try { this.cdr.detectChanges(); } catch {}
    this.saveEdit(r);
    try { this.cdr.markForCheck(); } catch {}
  }

  submitCancelEdit() {
    try { this.cdr.detectChanges(); } catch {}
    this.cancelEdit();
    try { this.cdr.markForCheck(); } catch {}
  }

  startEdit(r: PricingRecord) {
    console.log('startEdit clicked', r);
    this.editingId = r.pricingRecordId;
    this.editPrice = r.price;
  }

  async saveEdit(r: PricingRecord) {
    console.log('saveEdit clicked', { editingId: this.editingId, editPrice: this.editPrice });
    if (this.editingId == null) return;
    try {
      const updated = await lastValueFrom(this.api.updatePrice(this.editingId, this.editPrice));
      const idx = this.results.findIndex(x => x.pricingRecordId === this.editingId);
      if (idx >= 0) this.results[idx] = updated;
      this.editingId = null;
      try { this.cdr.markForCheck(); } catch {}
    } catch (err: any) {
      alert("Save failed: " + (err?.message || "unknown"));
    }
  }

  cancelEdit() {
    console.log('cancelEdit clicked');
    this.editingId = null;
  }
}

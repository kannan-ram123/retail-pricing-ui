export interface PricingRecord {
  pricingRecordId: number;
  storeId: number;
  sku: string;
  price: number;
  priceDate: string;
  uploadBatchID?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

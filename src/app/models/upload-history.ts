export interface UploadHistory {
  uploadId: string;
  fileName: string;
  uploadedAt: string;
  status: string;
  totalRecords?: number;
  failedRecords?: number;
  remarks?: string | null;
}

export type BookingStatus =
  | 'BOOKED'
  | 'PICKED_UP'
  | 'DIAGNOSING'
  | 'AWAITING_APPROVAL'
  | 'IN_REPAIR'
  | 'QUALITY_CHECK'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'WARRANTY_ACTIVE'
  | 'WARRANTY_EXPIRED'
  | 'DECLINED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceBrand: string;
  deviceModel: string;
  issueDescription: string;
  pickupAddress: string;
  pickupSlot: string;
  status: BookingStatus;
  bookingFeePaid: boolean;
  finalPrice?: number;
  createdAt: number;
  deliveredAt?: number;
  warrantyDurationDays?: number;
}

export interface RepairPhoto {
  id: string;
  bookingId: string;
  stage: BookingStatus;
  photoUrl: string;
  caption?: string;
  timestamp: number;
}

export interface ApprovalRequest {
  id: string;
  bookingId: string;
  diagnosisText: string;
  quotedPrice: number;
  partsDetail: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  requestedAt: number;
  respondedAt?: number;
}

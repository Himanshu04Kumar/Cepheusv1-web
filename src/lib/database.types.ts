export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          device_brand: string
          device_model: string
          issue_description: string
          pickup_address: string
          pickup_slot: string
          status: string
          booking_fee_paid: boolean
          final_price: number | null
          created_at: string
          delivered_at: string | null
          warranty_duration_days: number | null
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone: string
          device_brand: string
          device_model: string
          issue_description: string
          pickup_address: string
          pickup_slot: string
          status?: string
          booking_fee_paid?: boolean
          final_price?: number | null
          created_at?: string
          delivered_at?: string | null
          warranty_duration_days?: number | null
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          device_brand?: string
          device_model?: string
          issue_description?: string
          pickup_address?: string
          pickup_slot?: string
          status?: string
          booking_fee_paid?: boolean
          final_price?: number | null
          created_at?: string
          delivered_at?: string | null
          warranty_duration_days?: number | null
        }
      }
      repair_photos: {
        Row: {
          id: string
          booking_id: string
          stage: string
          photo_url: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          stage: string
          photo_url: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          stage?: string
          photo_url?: string
          caption?: string | null
          created_at?: string
        }
      }
      approval_requests: {
        Row: {
          id: string
          booking_id: string
          diagnosis_text: string
          quoted_price: number
          parts_detail: string
          status: string
          requested_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          booking_id: string
          diagnosis_text: string
          quoted_price: number
          parts_detail: string
          status?: string
          requested_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: string
          booking_id?: string
          diagnosis_text?: string
          quoted_price?: number
          parts_detail?: string
          status?: string
          requested_at?: string
          responded_at?: string | null
        }
      }
    }
  }
}

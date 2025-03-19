export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cancellations: {
        Row: {
          appointment_date: string
          appointment_id: string
          cancellation_date: string
          cancellation_reason: string
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          patient_name: string
          procedure_code: string
          procedure_description: string
          provider_name: string
        }
        Insert: {
          appointment_date: string
          appointment_id: string
          cancellation_date?: string
          cancellation_reason: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          patient_name: string
          procedure_code: string
          procedure_description: string
          provider_name: string
        }
        Update: {
          appointment_date?: string
          appointment_id?: string
          cancellation_date?: string
          cancellation_reason?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          patient_name?: string
          procedure_code?: string
          procedure_description?: string
          provider_name?: string
        }
        Relationships: []
      }
      dashboard_stats: {
        Row: {
          cleared_payments: number
          completed_follow_ups: number
          id: string
          last_updated: string
          low_stock_items: number
          next_day_cancellations: number
          pending_follow_ups: number
          pending_payments: number
          pending_time_off: number
          restocked_items: number
          shifts_completed: number
          staff_on_duty: number
          today_inventory_updates: number
          today_transactions: number
          todays_follow_ups: number
          urgent_tasks: number
        }
        Insert: {
          cleared_payments?: number
          completed_follow_ups?: number
          id?: string
          last_updated?: string
          low_stock_items?: number
          next_day_cancellations?: number
          pending_follow_ups?: number
          pending_payments?: number
          pending_time_off?: number
          restocked_items?: number
          shifts_completed?: number
          staff_on_duty?: number
          today_inventory_updates?: number
          today_transactions?: number
          todays_follow_ups?: number
          urgent_tasks?: number
        }
        Update: {
          cleared_payments?: number
          completed_follow_ups?: number
          id?: string
          last_updated?: string
          low_stock_items?: number
          next_day_cancellations?: number
          pending_follow_ups?: number
          pending_payments?: number
          pending_time_off?: number
          restocked_items?: number
          shifts_completed?: number
          staff_on_duty?: number
          today_inventory_updates?: number
          today_transactions?: number
          todays_follow_ups?: number
          urgent_tasks?: number
        }
        Relationships: []
      }
      follow_up_tasks: {
        Row: {
          appointment_id: string | null
          contact_info: string
          created_at: string
          due_date: string
          follow_up_type: string
          id: string
          notes: string | null
          patient_id: string
          patient_name: string
          priority: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          contact_info: string
          created_at?: string
          due_date: string
          follow_up_type: string
          id?: string
          notes?: string | null
          patient_id: string
          patient_name: string
          priority?: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          contact_info?: string
          created_at?: string
          due_date?: string
          follow_up_type?: string
          id?: string
          notes?: string | null
          patient_id?: string
          patient_name?: string
          priority?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone_number: string | null
          preferred_contact_method: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name: string
          phone_number?: string | null
          preferred_contact_method?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone_number?: string | null
          preferred_contact_method?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

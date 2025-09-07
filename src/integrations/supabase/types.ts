export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_data: {
        Row: {
          file_size: number
          filename: string
          id: string
          metadata: Json | null
          processed_records: number | null
          processing_status: string | null
          total_records: number
          upload_date: string
          uploaded_by: string
        }
        Insert: {
          file_size: number
          filename: string
          id?: string
          metadata?: Json | null
          processed_records?: number | null
          processing_status?: string | null
          total_records: number
          upload_date?: string
          uploaded_by: string
        }
        Update: {
          file_size?: number
          filename?: string
          id?: string
          metadata?: Json | null
          processed_records?: number | null
          processing_status?: string | null
          total_records?: number
          upload_date?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      anomalies: {
        Row: {
          anomaly_type: string
          courier_id: string | null
          description: string
          detected_at: string
          id: string
          is_resolved: boolean | null
          order_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["anomaly_severity"] | null
        }
        Insert: {
          anomaly_type: string
          courier_id?: string | null
          description: string
          detected_at?: string
          id?: string
          is_resolved?: boolean | null
          order_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["anomaly_severity"] | null
        }
        Update: {
          anomaly_type?: string
          courier_id?: string | null
          description?: string
          detected_at?: string
          id?: string
          is_resolved?: boolean | null
          order_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["anomaly_severity"] | null
        }
        Relationships: [
          {
            foreignKeyName: "anomalies_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "couriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anomalies_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      couriers: {
        Row: {
          created_at: string
          current_location: unknown | null
          email: string | null
          id: string
          name: string
          on_time_deliveries: number | null
          phone: string | null
          rating: number | null
          status: Database["public"]["Enums"]["courier_status"] | null
          total_deliveries: number | null
          updated_at: string
          user_id: string | null
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string
          current_location?: unknown | null
          email?: string | null
          id?: string
          name: string
          on_time_deliveries?: number | null
          phone?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["courier_status"] | null
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string | null
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string
          current_location?: unknown | null
          email?: string | null
          id?: string
          name?: string
          on_time_deliveries?: number | null
          phone?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["courier_status"] | null
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      delivery_tracking: {
        Row: {
          courier_id: string | null
          id: string
          location: unknown
          notes: string | null
          order_id: string
          status: Database["public"]["Enums"]["delivery_status"]
          timestamp: string
        }
        Insert: {
          courier_id?: string | null
          id?: string
          location: unknown
          notes?: string | null
          order_id: string
          status: Database["public"]["Enums"]["delivery_status"]
          timestamp?: string
        }
        Update: {
          courier_id?: string | null
          id?: string
          location?: unknown
          notes?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["delivery_status"]
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "couriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery_time: string | null
          actual_pickup_time: string | null
          courier_id: string | null
          created_at: string
          customer_name: string
          customer_phone: string | null
          delivery_address: string
          delivery_location: unknown
          estimated_delivery_time: string | null
          estimated_pickup_time: string | null
          id: string
          order_number: string
          pickup_address: string
          pickup_location: unknown
          priority_level: number | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["delivery_status"] | null
          updated_at: string
        }
        Insert: {
          actual_delivery_time?: string | null
          actual_pickup_time?: string | null
          courier_id?: string | null
          created_at?: string
          customer_name: string
          customer_phone?: string | null
          delivery_address: string
          delivery_location: unknown
          estimated_delivery_time?: string | null
          estimated_pickup_time?: string | null
          id?: string
          order_number: string
          pickup_address: string
          pickup_location: unknown
          priority_level?: number | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          updated_at?: string
        }
        Update: {
          actual_delivery_time?: string | null
          actual_pickup_time?: string | null
          courier_id?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string | null
          delivery_address?: string
          delivery_location?: unknown
          estimated_delivery_time?: string | null
          estimated_pickup_time?: string | null
          id?: string
          order_number?: string
          pickup_address?: string
          pickup_location?: unknown
          priority_level?: number | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "couriers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      zones: {
        Row: {
          avg_delivery_time: number | null
          boundary_coordinates: string | null
          created_at: string
          delivery_fee: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          avg_delivery_time?: number | null
          boundary_coordinates?: string | null
          created_at?: string
          delivery_fee?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          avg_delivery_time?: number | null
          boundary_coordinates?: string | null
          created_at?: string
          delivery_fee?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
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
      anomaly_severity: "low" | "medium" | "high" | "critical"
      courier_status: "offline" | "available" | "busy" | "on_break"
      delivery_status:
        | "pending"
        | "assigned"
        | "picked_up"
        | "in_transit"
        | "delivered"
        | "failed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      anomaly_severity: ["low", "medium", "high", "critical"],
      courier_status: ["offline", "available", "busy", "on_break"],
      delivery_status: [
        "pending",
        "assigned",
        "picked_up",
        "in_transit",
        "delivered",
        "failed",
        "cancelled",
      ],
    },
  },
} as const

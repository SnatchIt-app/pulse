export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      leads: {
        Row: {
          budget_tier: string | null;
          client_id: string | null;
          created_at: string;
          email: string;
          end_date: string | null;
          full_name: string;
          id: string;
          landing_page: string | null;
          last_contacted_at: string | null;
          lost_reason: string | null;
          message: string | null;
          owner_id: string | null;
          party_size: number | null;
          phone: string | null;
          referrer_url: string | null;
          service_type: Database["public"]["Enums"]["service_type"];
          source: string;
          start_date: string | null;
          status: Database["public"]["Enums"]["lead_status"];
          updated_at: string;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          utm_term: string | null;
          vehicle_id: string | null;
        };
        Insert: {
          budget_tier?: string | null;
          client_id?: string | null;
          created_at?: string;
          email: string;
          end_date?: string | null;
          full_name: string;
          id?: string;
          landing_page?: string | null;
          last_contacted_at?: string | null;
          lost_reason?: string | null;
          message?: string | null;
          owner_id?: string | null;
          party_size?: number | null;
          phone?: string | null;
          referrer_url?: string | null;
          service_type?: Database["public"]["Enums"]["service_type"];
          source?: string;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
          vehicle_id?: string | null;
        };
        Update: {
          budget_tier?: string | null;
          client_id?: string | null;
          created_at?: string;
          email?: string;
          end_date?: string | null;
          full_name?: string;
          id?: string;
          landing_page?: string | null;
          last_contacted_at?: string | null;
          lost_reason?: string | null;
          message?: string | null;
          owner_id?: string | null;
          party_size?: number | null;
          phone?: string | null;
          referrer_url?: string | null;
          service_type?: Database["public"]["Enums"]["service_type"];
          source?: string;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
          vehicle_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      residence_availability: {
        Row: {
          available: boolean;
          date: string;
          id: string;
          last_synced_at: string;
          min_stay: number | null;
          nightly_rate: number | null;
          residence_id: string;
          source: Database["public"]["Enums"]["residence_source_type"];
        };
        Insert: {
          available?: boolean;
          date: string;
          id?: string;
          last_synced_at?: string;
          min_stay?: number | null;
          nightly_rate?: number | null;
          residence_id: string;
          source?: Database["public"]["Enums"]["residence_source_type"];
        };
        Update: {
          available?: boolean;
          date?: string;
          id?: string;
          last_synced_at?: string;
          min_stay?: number | null;
          nightly_rate?: number | null;
          residence_id?: string;
          source?: Database["public"]["Enums"]["residence_source_type"];
        };
        Relationships: [
          {
            foreignKeyName: "residence_availability_residence_id_fkey";
            columns: ["residence_id"];
            isOneToOne: false;
            referencedRelation: "residences";
            referencedColumns: ["id"];
          },
        ];
      };
      residence_bookings: {
        Row: {
          base_cost_internal: number | null;
          client_id: string | null;
          client_price: number | null;
          created_at: string;
          deposit_amount: number | null;
          deposit_status: string | null;
          end_date: string;
          guests: number | null;
          id: string;
          margin: number | null;
          notes: string | null;
          residence_id: string;
          start_date: string;
          status: Database["public"]["Enums"]["residence_booking_status"];
          updated_at: string;
        };
        Insert: {
          base_cost_internal?: number | null;
          client_id?: string | null;
          client_price?: number | null;
          created_at?: string;
          deposit_amount?: number | null;
          deposit_status?: string | null;
          end_date: string;
          guests?: number | null;
          id?: string;
          margin?: number | null;
          notes?: string | null;
          residence_id: string;
          start_date: string;
          status?: Database["public"]["Enums"]["residence_booking_status"];
          updated_at?: string;
        };
        Update: {
          base_cost_internal?: number | null;
          client_id?: string | null;
          client_price?: number | null;
          created_at?: string;
          deposit_amount?: number | null;
          deposit_status?: string | null;
          end_date?: string;
          guests?: number | null;
          id?: string;
          margin?: number | null;
          notes?: string | null;
          residence_id?: string;
          start_date?: string;
          status?: Database["public"]["Enums"]["residence_booking_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "residence_bookings_residence_id_fkey";
            columns: ["residence_id"];
            isOneToOne: false;
            referencedRelation: "residences";
            referencedColumns: ["id"];
          },
        ];
      };
      residence_requests: {
        Row: {
          budget: number | null;
          created_at: string;
          end_date: string | null;
          guests: number | null;
          id: string;
          lead_id: string | null;
          message: string | null;
          residence_id: string | null;
          start_date: string | null;
          status: Database["public"]["Enums"]["residence_request_status"];
          updated_at: string;
        };
        Insert: {
          budget?: number | null;
          created_at?: string;
          end_date?: string | null;
          guests?: number | null;
          id?: string;
          lead_id?: string | null;
          message?: string | null;
          residence_id?: string | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["residence_request_status"];
          updated_at?: string;
        };
        Update: {
          budget?: number | null;
          created_at?: string;
          end_date?: string | null;
          guests?: number | null;
          id?: string;
          lead_id?: string | null;
          message?: string | null;
          residence_id?: string | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["residence_request_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "residence_requests_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "residence_requests_residence_id_fkey";
            columns: ["residence_id"];
            isOneToOne: false;
            referencedRelation: "residences";
            referencedColumns: ["id"];
          },
        ];
      };
      residences: {
        Row: {
          address_private: string | null;
          amenities: string[];
          base_rate_internal: number | null;
          bathrooms: number;
          bedrooms: number;
          created_at: string;
          description: string | null;
          display_order: number;
          external_property_id: string | null;
          final_rate_display: number | null;
          gallery: Json;
          hero_image_url: string | null;
          id: string;
          internal_source_name: string | null;
          internal_source_url: string | null;
          is_featured: boolean;
          markup_type: Database["public"]["Enums"]["residence_markup_type"] | null;
          markup_value: number | null;
          max_guests: number;
          min_stay: number | null;
          neighborhood: string | null;
          nightly_rate_from: number | null;
          public_location_label: string | null;
          slug: string;
          source_calendar_url: string | null;
          source_type: Database["public"]["Enums"]["residence_source_type"];
          status: Database["public"]["Enums"]["residence_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          address_private?: string | null;
          amenities?: string[];
          base_rate_internal?: number | null;
          bathrooms?: number;
          bedrooms?: number;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          external_property_id?: string | null;
          final_rate_display?: number | null;
          gallery?: Json;
          hero_image_url?: string | null;
          id?: string;
          internal_source_name?: string | null;
          internal_source_url?: string | null;
          is_featured?: boolean;
          markup_type?: Database["public"]["Enums"]["residence_markup_type"] | null;
          markup_value?: number | null;
          max_guests?: number;
          min_stay?: number | null;
          neighborhood?: string | null;
          nightly_rate_from?: number | null;
          public_location_label?: string | null;
          slug: string;
          source_calendar_url?: string | null;
          source_type?: Database["public"]["Enums"]["residence_source_type"];
          status?: Database["public"]["Enums"]["residence_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          address_private?: string | null;
          amenities?: string[];
          base_rate_internal?: number | null;
          bathrooms?: number;
          bedrooms?: number;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          external_property_id?: string | null;
          final_rate_display?: number | null;
          gallery?: Json;
          hero_image_url?: string | null;
          id?: string;
          internal_source_name?: string | null;
          internal_source_url?: string | null;
          is_featured?: boolean;
          markup_type?: Database["public"]["Enums"]["residence_markup_type"] | null;
          markup_value?: number | null;
          max_guests?: number;
          min_stay?: number | null;
          neighborhood?: string | null;
          nightly_rate_from?: number | null;
          public_location_label?: string | null;
          slug?: string;
          source_calendar_url?: string | null;
          source_type?: Database["public"]["Enums"]["residence_source_type"];
          status?: Database["public"]["Enums"]["residence_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          is_active: boolean;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          is_active?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      vehicles: {
        Row: {
          body_style: string | null;
          color_exterior: string | null;
          color_interior: string | null;
          created_at: string;
          current_location: string | null;
          daily_rate: number | null;
          delivery_fee: number | null;
          description: string | null;
          display_order: number;
          drivetrain: string | null;
          gallery: Json;
          hero_image_url: string | null;
          hero_video_url: string | null;
          horsepower: number | null;
          id: string;
          included_miles: number | null;
          is_featured: boolean;
          make: string;
          model: string;
          seats: number | null;
          slug: string;
          status: Database["public"]["Enums"]["vehicle_status"];
          top_speed: number | null;
          transmission: string | null;
          trim: string | null;
          updated_at: string;
          weekend_rate: number | null;
          weekly_rate: number | null;
          year: number;
          zero_sixty: number | null;
        };
        Insert: {
          body_style?: string | null;
          color_exterior?: string | null;
          color_interior?: string | null;
          created_at?: string;
          current_location?: string | null;
          daily_rate?: number | null;
          delivery_fee?: number | null;
          description?: string | null;
          display_order?: number;
          drivetrain?: string | null;
          gallery?: Json;
          hero_image_url?: string | null;
          hero_video_url?: string | null;
          horsepower?: number | null;
          id?: string;
          included_miles?: number | null;
          is_featured?: boolean;
          make: string;
          model: string;
          seats?: number | null;
          slug: string;
          status?: Database["public"]["Enums"]["vehicle_status"];
          top_speed?: number | null;
          transmission?: string | null;
          trim?: string | null;
          updated_at?: string;
          weekend_rate?: number | null;
          weekly_rate?: number | null;
          year: number;
          zero_sixty?: number | null;
        };
        Update: {
          body_style?: string | null;
          color_exterior?: string | null;
          color_interior?: string | null;
          created_at?: string;
          current_location?: string | null;
          daily_rate?: number | null;
          delivery_fee?: number | null;
          description?: string | null;
          display_order?: number;
          drivetrain?: string | null;
          gallery?: Json;
          hero_image_url?: string | null;
          hero_video_url?: string | null;
          horsepower?: number | null;
          id?: string;
          included_miles?: number | null;
          is_featured?: boolean;
          make?: string;
          model?: string;
          seats?: number | null;
          slug?: string;
          status?: Database["public"]["Enums"]["vehicle_status"];
          top_speed?: number | null;
          transmission?: string | null;
          trim?: string | null;
          updated_at?: string;
          weekend_rate?: number | null;
          weekly_rate?: number | null;
          year?: number;
          zero_sixty?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      lead_status: "new" | "contacted" | "qualified" | "quoted" | "booked" | "completed" | "lost";
      residence_booking_status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
      residence_markup_type: "flat" | "percent";
      residence_request_status: "new" | "contacted" | "quoted" | "booked" | "lost";
      residence_source_type: "ical" | "api" | "scrape" | "manual";
      residence_status: "available" | "unavailable" | "retired";
      service_type:
        | "car"
        | "jet"
        | "yacht"
        | "jet_ski"
        | "chauffeur"
        | "restaurant"
        | "nightlife"
        | "concierge"
        | "residence"
        | "other";
      user_role: "owner" | "admin" | "agent" | "viewer";
      vehicle_status: "available" | "on_trip" | "maintenance" | "retired";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      lead_status: ["new", "contacted", "qualified", "quoted", "booked", "completed", "lost"],
      residence_booking_status: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      residence_markup_type: ["flat", "percent"],
      residence_request_status: ["new", "contacted", "quoted", "booked", "lost"],
      residence_source_type: ["ical", "api", "scrape", "manual"],
      residence_status: ["available", "unavailable", "retired"],
      service_type: [
        "car",
        "jet",
        "yacht",
        "jet_ski",
        "chauffeur",
        "restaurant",
        "nightlife",
        "concierge",
        "residence",
        "other",
      ],
      user_role: ["owner", "admin", "agent", "viewer"],
      vehicle_status: ["available", "on_trip", "maintenance", "retired"],
    },
  },
} as const;

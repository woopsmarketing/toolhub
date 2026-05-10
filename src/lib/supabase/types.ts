/**
 * Toolhub — Supabase Database 타입 (자동 생성, 수정 금지).
 *
 * 재생성 방법: `mcp__supabase__generate_typescript_types` MCP 도구 호출 후 결과 붙여넣기.
 * 스키마 변경(supabase/migrations/*.sql) 후 반드시 갱신할 것.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      ai_generations: {
        Row: {
          cost_usd: number | null;
          created_at: string;
          id: string;
          metadata: Json | null;
          model: string | null;
          tokens_in: number | null;
          tokens_out: number | null;
          tool_slug: string;
          user_id: string;
        };
        Insert: {
          cost_usd?: number | null;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          model?: string | null;
          tokens_in?: number | null;
          tokens_out?: number | null;
          tool_slug: string;
          user_id: string;
        };
        Update: {
          cost_usd?: number | null;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          model?: string | null;
          tokens_in?: number | null;
          tokens_out?: number | null;
          tool_slug?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_generations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          id: string;
          locale: string;
          nickname: string | null;
          plan: Database["public"]["Enums"]["user_plan"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          id: string;
          locale?: string;
          nickname?: string | null;
          plan?: Database["public"]["Enums"]["user_plan"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          locale?: string;
          nickname?: string | null;
          plan?: Database["public"]["Enums"]["user_plan"];
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          brand_voice: string | null;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          brand_voice?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          brand_voice?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tool_favorites: {
        Row: {
          created_at: string;
          id: string;
          tool_slug: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          tool_slug: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          tool_slug?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tool_favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tool_feedback: {
        Row: {
          anonymous_id: string | null;
          comment: string | null;
          created_at: string;
          id: string;
          locale: string | null;
          rating: number;
          tool_slug: string;
          user_id: string | null;
        };
        Insert: {
          anonymous_id?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: string;
          locale?: string | null;
          rating: number;
          tool_slug: string;
          user_id?: string | null;
        };
        Update: {
          anonymous_id?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: string;
          locale?: string | null;
          rating?: number;
          tool_slug?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tool_feedback_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tool_histories: {
        Row: {
          created_at: string;
          id: string;
          input_summary: string | null;
          metadata: Json | null;
          result_summary: string | null;
          tool_slug: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          input_summary?: string | null;
          metadata?: Json | null;
          result_summary?: string | null;
          tool_slug: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          input_summary?: string | null;
          metadata?: Json | null;
          result_summary?: string | null;
          tool_slug?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tool_histories_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tool_usage_events: {
        Row: {
          anonymous_id: string | null;
          category: string | null;
          created_at: string;
          event_name: string;
          id: number;
          locale: string | null;
          processing: string | null;
          properties: Json | null;
          referrer: string | null;
          template: string | null;
          tool_slug: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          anonymous_id?: string | null;
          category?: string | null;
          created_at?: string;
          event_name: string;
          id?: number;
          locale?: string | null;
          processing?: string | null;
          properties?: Json | null;
          referrer?: string | null;
          template?: string | null;
          tool_slug?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          anonymous_id?: string | null;
          category?: string | null;
          created_at?: string;
          event_name?: string;
          id?: number;
          locale?: string | null;
          processing?: string | null;
          properties?: Json | null;
          referrer?: string | null;
          template?: string | null;
          tool_slug?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tool_usage_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_tool_settings: {
        Row: {
          settings: Json;
          tool_slug: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          settings?: Json;
          tool_slug: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          settings?: Json;
          tool_slug?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_tool_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      v_category_usage_30d: {
        Row: {
          category: string | null;
          total_events: number | null;
          unique_tools: number | null;
          unique_users: number | null;
        };
        Relationships: [];
      };
      v_daily_active_users: {
        Row: {
          dau: number | null;
          day: string | null;
        };
        Relationships: [];
      };
      v_popular_tools_30d: {
        Row: {
          category: string | null;
          tool_slug: string | null;
          unique_users: number | null;
          uses: number | null;
          views: number | null;
        };
        Relationships: [];
      };
      v_tool_ratings: {
        Row: {
          avg_rating: number | null;
          rating_count: number | null;
          tool_slug: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      tool_status: "draft" | "published" | "archived";
      user_plan: "free" | "pro";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

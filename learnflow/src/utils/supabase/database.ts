export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
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
      questions: {
        Row: {
          correct_answer: string;
          correct_explanation: string | null;
          created_at: string | null;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          position: number;
          question_id: number;
          question_text: string;
          quiz_id: number | null;
          wrong_explanation_a: string | null;
          wrong_explanation_b: string | null;
          wrong_explanation_c: string | null;
          wrong_explanation_d: string | null;
        };
        Insert: {
          correct_answer: string;
          correct_explanation?: string | null;
          created_at?: string | null;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          position: number;
          question_id?: number;
          question_text: string;
          quiz_id?: number | null;
          wrong_explanation_a?: string | null;
          wrong_explanation_b?: string | null;
          wrong_explanation_c?: string | null;
          wrong_explanation_d?: string | null;
        };
        Update: {
          correct_answer?: string;
          correct_explanation?: string | null;
          created_at?: string | null;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          position?: number;
          question_id?: number;
          question_text?: string;
          quiz_id?: number | null;
          wrong_explanation_a?: string | null;
          wrong_explanation_b?: string | null;
          wrong_explanation_c?: string | null;
          wrong_explanation_d?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["quiz_id"];
          },
        ];
      };
      quiz_results: {
        Row: {
          correct_count: number;
          created_at: string | null;
          percentage: number;
          quiz_id: number | null;
          resources: Json | null;
          result_id: number;
          total_count: number;
          user_id: number | null;
          youtube_resources: Json | null;
        };
        Insert: {
          correct_count: number;
          created_at?: string | null;
          percentage: number;
          quiz_id?: number | null;
          resources?: Json | null;
          result_id?: number;
          total_count: number;
          user_id?: number | null;
          youtube_resources?: Json | null;
        };
        Update: {
          correct_count?: number;
          created_at?: string | null;
          percentage?: number;
          quiz_id?: number | null;
          resources?: Json | null;
          result_id?: number;
          total_count?: number;
          user_id?: number | null;
          youtube_resources?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_results_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["quiz_id"];
          },
          {
            foreignKeyName: "quiz_results_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      quizzes: {
        Row: {
          created_at: string | null;
          difficulty: string;
          experience_level: string | null;
          learning_goal: string | null;
          name: string | null;
          quiz_id: number;
          topic: string;
          updated_at: string | null;
          user_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          difficulty: string;
          experience_level?: string | null;
          learning_goal?: string | null;
          name?: string | null;
          quiz_id?: number;
          topic: string;
          updated_at?: string | null;
          user_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          difficulty?: string;
          experience_level?: string | null;
          learning_goal?: string | null;
          name?: string | null;
          quiz_id?: number;
          topic?: string;
          updated_at?: string | null;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "quizzes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      summaries: {
        Row: {
          created_at: string | null;
          id: number;
          original_text: string | null;
          source_info: string | null;
          source_url: string | null;
          summary: string;
          title: string | null;
          type: string | null;
          user_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          original_text?: string | null;
          source_info?: string | null;
          source_url?: string | null;
          summary: string;
          title?: string | null;
          type?: string | null;
          user_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          original_text?: string | null;
          source_info?: string | null;
          source_url?: string | null;
          summary?: string;
          title?: string | null;
          type?: string | null;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "summaries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      summary_questions: {
        Row: {
          correct_answer: string;
          created_at: string | null;
          explanation: string | null;
          id: number;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          question_text: string;
          summary_id: number | null;
        };
        Insert: {
          correct_answer: string;
          created_at?: string | null;
          explanation?: string | null;
          id?: number;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          question_text: string;
          summary_id?: number | null;
        };
        Update: {
          correct_answer?: string;
          created_at?: string | null;
          explanation?: string | null;
          id?: number;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          question_text?: string;
          summary_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "summary_questions_summary_id_fkey";
            columns: ["summary_id"];
            isOneToOne: false;
            referencedRelation: "summaries";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          email: string;
          first_name: string | null;
          last_name: string | null;
          user_id: number;
          user_uuid: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          user_id?: number;
          user_uuid: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          user_id?: number;
          user_uuid?: string;
          username?: string | null;
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;

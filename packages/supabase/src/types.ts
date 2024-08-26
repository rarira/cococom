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
      categories: {
        Row: {
          categoryName: string
          categorySector: Database["public"]["Enums"]["CategorySectors"]
          id: number
        }
        Insert: {
          categoryName: string
          categorySector?: Database["public"]["Enums"]["CategorySectors"]
          id: number
        }
        Update: {
          categoryName?: string
          categorySector?: Database["public"]["Enums"]["CategorySectors"]
          id?: number
        }
        Relationships: []
      }
      discounts: {
        Row: {
          created_at: string | null
          discount: number
          discountHash: string
          discountPrice: number
          discountRate: number | null
          endDate: string
          id: number
          itemId: string
          price: number
          startDate: string
        }
        Insert: {
          created_at?: string | null
          discount: number
          discountHash: string
          discountPrice: number
          discountRate?: number | null
          endDate: string
          id?: number
          itemId: string
          price: number
          startDate: string
        }
        Update: {
          created_at?: string | null
          discount?: number
          discountHash?: string
          discountPrice?: number
          discountRate?: number | null
          endDate?: string
          id?: number
          itemId?: string
          price?: number
          startDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "discounts_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["itemId"]
          },
        ]
      }
      histories: {
        Row: {
          added_discount_count: number | null
          created_at: string
          id: number
          new_item_count: number | null
          no_images: string[] | null
        }
        Insert: {
          added_discount_count?: number | null
          created_at?: string
          id?: number
          new_item_count?: number | null
          no_images?: string[] | null
        }
        Update: {
          added_discount_count?: number | null
          created_at?: string
          id?: number
          new_item_count?: number | null
          no_images?: string[] | null
        }
        Relationships: []
      }
      items: {
        Row: {
          bestDiscount: number | null
          bestDiscountRate: number | null
          categoryId: number | null
          created_at: string | null
          id: number
          itemId: string
          itemName: string | null
          lowestPrice: number | null
          updated_at: string | null
        }
        Insert: {
          bestDiscount?: number | null
          bestDiscountRate?: number | null
          categoryId?: number | null
          created_at?: string | null
          id?: number
          itemId: string
          itemName?: string | null
          lowestPrice?: number | null
          updated_at?: string | null
        }
        Update: {
          bestDiscount?: number | null
          bestDiscountRate?: number | null
          categoryId?: number | null
          created_at?: string | null
          id?: number
          itemId?: string
          itemName?: string | null
          lowestPrice?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      memos: {
        Row: {
          content: string | null
          created_at: string
          id: number
          itemId: number | null
          updated_at: string | null
          userId: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          itemId?: number | null
          updated_at?: string | null
          userId?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          itemId?: number | null
          updated_at?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memos_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memos_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          confirmed: boolean | null
          created_at: string | null
          email: string | null
          email_verified: boolean | null
          id: string
          nickname: string | null
          picture: string | null
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          id: string
          nickname?: string | null
          picture?: string | null
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          id?: string
          nickname?: string | null
          picture?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          itemId: number
          userId: string
        }
        Insert: {
          created_at?: string
          id?: string
          itemId: number
          userId: string
        }
        Update: {
          created_at?: string
          id?: string
          itemId?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_wishlists_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_wishlists_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_discounts_by_category_sector: {
        Args: {
          _current_time_stamp: string
        }
        Returns: {
          id: number
          itemId: string
          categorySector: Database["public"]["Enums"]["CategorySectors"]
          discountsCount: number
        }[]
      }
      get_discounts_with_wishlist_counts: {
        Args: {
          _current_time_stamp: string
          _user_id: string
          _category_sector: Database["public"]["Enums"]["CategorySectors"]
        }
        Returns: {
          id: number
          startDate: string
          endDate: string
          price: number
          discountPrice: number
          discountRate: number
          discount: number
          items: Json
        }[]
      }
      get_items_with_wishlist_counts: {
        Args: {
          item_id: string
          user_id: string
          need_discounts: boolean
        }
        Returns: Json
      }
      get_items_with_wishlist_counts_by_id: {
        Args: {
          item_id: number
          user_id: string
          need_discounts: boolean
        }
        Returns: Json
      }
      search_items_by_itemid: {
        Args: {
          item_id: string
          is_on_sale: boolean
          user_id: string
          page: number
          page_size: number
          order_field: string
          order_direction: string
        }
        Returns: Json
      }
      search_items_by_keyword: {
        Args: {
          keyword: string
          is_on_sale: boolean
          user_id: string
          page: number
          page_size: number
          order_field: string
          order_direction: string
        }
        Returns: Json
      }
    }
    Enums: {
      CategorySectors:
        | "홈 데코"
        | "생활용품"
        | "디지털/가전"
        | "기타"
        | "건강/미용"
        | "의류/잡화"
        | "자동차/취미"
        | "신선식품"
        | "주류/음료"
        | "즉석식품/간식"
        | "식자재"
        | "냉장/냉동/가공식품"
        | "문구/사무/아동/반려"
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


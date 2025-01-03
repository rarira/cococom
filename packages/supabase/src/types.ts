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
      comments: {
        Row: {
          content: string
          created_at: string
          id: number
          item_id: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          item_id: number
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          item_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          created_at: string | null
          discount: number
          discountHash: string
          discountPrice: number
          discountRate: number | null
          endDate: string
          history_id: number | null
          id: number
          is_online: boolean
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
          history_id?: number | null
          id?: number
          is_online?: boolean
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
          history_id?: number | null
          id?: number
          is_online?: boolean
          itemId?: string
          price?: number
          startDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "discounts_history_id_fkey"
            columns: ["history_id"]
            isOneToOne: false
            referencedRelation: "histories"
            referencedColumns: ["id"]
          },
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
          is_online: boolean
          new_item_count: number | null
          no_images: string[] | null
          no_price: string[] | null
        }
        Insert: {
          added_discount_count?: number | null
          created_at?: string
          id?: number
          is_online?: boolean
          new_item_count?: number | null
          no_images?: string[] | null
          no_price?: string[] | null
        }
        Update: {
          added_discount_count?: number | null
          created_at?: string
          id?: number
          is_online?: boolean
          new_item_count?: number | null
          no_images?: string[] | null
          no_price?: string[] | null
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
          is_online: boolean
          itemId: string
          itemName: string | null
          lowestPrice: number | null
          online_url: string | null
          related_item_id: number | null
          totalCommentCount: number | null
          totalDiscountCount: number | null
          totalWishlistCount: number | null
          updated_at: string | null
        }
        Insert: {
          bestDiscount?: number | null
          bestDiscountRate?: number | null
          categoryId?: number | null
          created_at?: string | null
          id?: number
          is_online?: boolean
          itemId: string
          itemName?: string | null
          lowestPrice?: number | null
          online_url?: string | null
          related_item_id?: number | null
          totalCommentCount?: number | null
          totalDiscountCount?: number | null
          totalWishlistCount?: number | null
          updated_at?: string | null
        }
        Update: {
          bestDiscount?: number | null
          bestDiscountRate?: number | null
          categoryId?: number | null
          created_at?: string | null
          id?: number
          is_online?: boolean
          itemId?: string
          itemName?: string | null
          lowestPrice?: number | null
          online_url?: string | null
          related_item_id?: number | null
          totalCommentCount?: number | null
          totalDiscountCount?: number | null
          totalWishlistCount?: number | null
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
            foreignKeyName: "memos_itemid_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memos_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          confirmed: boolean | null
          created_at: string | null
          email: string | null
          email_opted_in: boolean
          email_verified: boolean | null
          expo_push_token: string | null
          id: string
          nickname: string | null
          picture: string | null
          subscription_level: Database["public"]["Enums"]["subscription_level_type"]
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string | null
          email?: string | null
          email_opted_in?: boolean
          email_verified?: boolean | null
          expo_push_token?: string | null
          id: string
          nickname?: string | null
          picture?: string | null
          subscription_level?: Database["public"]["Enums"]["subscription_level_type"]
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string | null
          email?: string | null
          email_opted_in?: boolean
          email_verified?: boolean | null
          expo_push_token?: string | null
          id?: string
          nickname?: string | null
          picture?: string | null
          subscription_level?: Database["public"]["Enums"]["subscription_level_type"]
        }
        Relationships: []
      }
      subscription_limits: {
        Row: {
          max_wishlist_limit: number
          subscription_level: string
        }
        Insert: {
          max_wishlist_limit: number
          subscription_level: string
        }
        Update: {
          max_wishlist_limit?: number
          subscription_level?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          itemId: number
          userId: string
          wishlist_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          itemId: number
          userId: string
          wishlist_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          itemId?: number
          userId?: string
          wishlist_hash?: string
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
      get_alltime_top_items: {
        Args: {
          _channel: string
          _user_id: string
          _order_by_column: string
          _order_by_direction: string
          _limit_count: number
        }
        Returns: {
          id: number
          itemName: string
          itemId: string
          created_at: string
          bestDiscountRate: number
          lowestPrice: number
          bestDiscount: number
          totalWishlistCount: number
          totalCommentCount: number
          totalDiscountCount: number
          totalMemoCount: number
          isWishlistedByUser: boolean
          isOnSaleNow: boolean
          is_online: boolean
        }[]
      }
      get_current_discounts_by_category_sector: {
        Args: {
          _current_time_stamp: string
        }
        Returns: {
          id: number
          itemId: string
          categorySector: Database["public"]["Enums"]["CategorySectors"]
          discountsCountOnline: number
          discountsCountOffline: number
        }[]
      }
      get_discounted_ranking_with_wishlist_counts: {
        Args: {
          _current_time_stamp: string
          _user_id: string
          _channel: string
          _limit: number
          _order_field: string
          _order_direction: string
        }
        Returns: {
          id: number
          startDate: string
          endDate: string
          price: number
          discountPrice: number
          discountRate: number
          discount: number
          is_online: boolean
          items: Json
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
          is_online: boolean
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
      get_latest_histories: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          created_at: string
          is_online: boolean
          total_discounts_count: number
        }[]
      }
      get_wishlist_items: {
        Args: {
          user_id: string
          is_on_sale: boolean
          page: number
          page_size: number
          order_field: string
          order_direction: string
          channel: string
        }
        Returns: Json
      }
      get_wishlist_items_on_sale_start: {
        Args: {
          user_uuid: string
          history_id_param: number
        }
        Returns: {
          wishlistId: string
          id: number
          itemId: string
          itemName: string
          is_online: boolean
        }[]
      }
      max_wishlist_limit: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      restart_table_sequence: {
        Args: {
          table_name: string
          new_value: number
        }
        Returns: undefined
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
          channel: string
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
          channel: string
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
      subscription_level_type: "basic" | "premium"
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


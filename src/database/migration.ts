import {
  addColumns,
  createTable,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: "app_settings",
          columns: [
            { name: "selected_language", type: "string", isOptional: true },
            { name: "onboarding_completed", type: "boolean" },
            {
              name: "active_profile_id",
              type: "string",
              isOptional: true,
              isIndexed: true,
            },
            { name: "last_selected_country_iso", type: "string", isOptional: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),

        createTable({
          name: "auth_session",
          columns: [
            {
              name: "account_id",
              type: "string",
              isOptional: true,
              isIndexed: true,
            },
            { name: "phone_number", type: "string" },
            { name: "country_code", type: "string" },
            { name: "country_iso", type: "string", isIndexed: true },
            { name: "is_verified", type: "boolean" },
            { name: "is_logged_in", type: "boolean" },
            { name: "access_token", type: "string", isOptional: true },
            { name: "refresh_token", type: "string", isOptional: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),

        createTable({
          name: "profiles",
          columns: [
            { name: "account_id", type: "string", isIndexed: true },
            { name: "profile_type", type: "string", isIndexed: true },
            { name: "profile_name", type: "string" },
            { name: "display_name", type: "string", isOptional: true },
            { name: "role_name", type: "string", isOptional: true },
            { name: "is_active", type: "boolean" },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),

        createTable({
          name: "business_profiles",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "business_name", type: "string" },
            {
              name: "business_category_id",
              type: "string",
              isOptional: true,
              isIndexed: true,
            },
            { name: "business_category_name", type: "string", isOptional: true },
            { name: "country_iso", type: "string", isOptional: true, isIndexed: true },
            { name: "currency_code", type: "string", isOptional: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),

        createTable({
          name: "business_categories",
          columns: [
            { name: "name", type: "string", isIndexed: true },
            { name: "parent_id", type: "string", isOptional: true, isIndexed: true },
            { name: "slug", type: "string", isIndexed: true },
            { name: "is_active", type: "boolean" },
            { name: "sort_order", type: "number" },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),

        createTable({
          name: "otp_requests",
          columns: [
            { name: "phone_number", type: "string", isIndexed: true },
            { name: "country_code", type: "string" },
            { name: "country_iso", type: "string", isIndexed: true },
            { name: "otp_reference_id", type: "string", isIndexed: true },
            { name: "expires_at", type: "number" },
            { name: "is_consumed", type: "boolean" },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: "profiles",
          columns: [
            {
              name: "business_category_id",
              type: "string",
              isOptional: true,
              isIndexed: true,
            },
            { name: "business_category_name", type: "string", isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        createTable({
          name: "finance_accounts",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "account_name", type: "string" },
            { name: "account_number", type: "string", isOptional: true },
            { name: "account_type", type: "string", isIndexed: true },
            { name: "is_primary", type: "boolean", isIndexed: true },
            { name: "currency_code", type: "string" },
            { name: "current_balance", type: "number" },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        createTable({
          name: "finance_transactions",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "account_id", type: "string", isOptional: true, isIndexed: true },
            { name: "entry_type", type: "string", isIndexed: true },
            { name: "category_name", type: "string", isOptional: true },
            { name: "counterparty_name", type: "string", isOptional: true },
            { name: "note", type: "string", isOptional: true },
            { name: "status", type: "string", isIndexed: true },
            { name: "amount", type: "number" },
            { name: "occurred_at", type: "number", isIndexed: true },
            {
              name: "reference_id",
              type: "string",
              isOptional: true,
              isIndexed: true,
            },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        createTable({
          name: "home_shortcuts",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "shortcut_key", type: "string", isIndexed: true },
            { name: "sort_order", type: "number" },
            { name: "is_enabled", type: "boolean", isIndexed: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        createTable({
          name: "transfer_beneficiaries",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "beneficiary_name", type: "string", isIndexed: true },
            { name: "bank_name", type: "string", isOptional: true },
            { name: "account_number", type: "string", isOptional: true },
            { name: "mobile_number", type: "string", isOptional: true },
            { name: "transfer_method", type: "string", isIndexed: true },
            { name: "is_favorite", type: "boolean", isIndexed: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        createTable({
          name: "transfer_records",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "beneficiary_id", type: "string", isIndexed: true },
            {
              name: "from_account_id",
              type: "string",
              isOptional: true,
              isIndexed: true,
            },
            { name: "amount", type: "number" },
            { name: "note", type: "string", isOptional: true },
            { name: "record_type", type: "string", isIndexed: true },
            { name: "scheduled_for", type: "number", isOptional: true, isIndexed: true },
            { name: "status", type: "string", isIndexed: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        createTable({
          name: "pos_items",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "item_name", type: "string", isIndexed: true },
            { name: "sku", type: "string", isOptional: true, isIndexed: true },
            { name: "unit_price", type: "number" },
            { name: "available_stock", type: "number" },
            { name: "is_active", type: "boolean", isIndexed: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        createTable({
          name: "pos_sales",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "account_id", type: "string", isOptional: true, isIndexed: true },
            { name: "sale_number", type: "string", isIndexed: true },
            { name: "line_items_json", type: "string" },
            { name: "total_amount", type: "number" },
            { name: "payment_mode", type: "string", isIndexed: true },
            { name: "status", type: "string", isIndexed: true },
            { name: "created_at", type: "number", isIndexed: true },
            { name: "updated_at", type: "number" },
          ],
        }),
      ],
    },
    {
      toVersion: 5,
      steps: [
        addColumns({
          table: "pos_items",
          columns: [
            {
              name: "category_name",
              type: "string",
              isOptional: true,
              isIndexed: true,
            },
          ],
        }),
        createTable({
          name: "quick_pos_category_slots",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "slot_order", type: "number", isIndexed: true },
            {
              name: "category_name",
              type: "string",
              isOptional: true,
              isIndexed: true,
            },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        createTable({
          name: "quick_pos_product_slots",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "category_name", type: "string", isIndexed: true },
            { name: "slot_order", type: "number", isIndexed: true },
            { name: "item_id", type: "string", isOptional: true, isIndexed: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
      ],
    },
    {
      toVersion: 6,
      steps: [
        createTable({
          name: "payment_records",
          columns: [
            { name: "profile_id", type: "string", isIndexed: true },
            { name: "direction", type: "string", isIndexed: true },
            { name: "party_name", type: "string", isIndexed: true },
            { name: "note", type: "string", isOptional: true },
            { name: "total_amount", type: "number" },
            { name: "settled_amount", type: "number" },
            { name: "status", type: "string", isIndexed: true },
            { name: "settled_at", type: "number", isOptional: true, isIndexed: true },
            { name: "created_at", type: "number", isIndexed: true },
            { name: "updated_at", type: "number" },
          ],
        }),
      ],
    },
    {
      toVersion: 7,
      steps: [
        addColumns({
          table: "app_settings",
          columns: [
            { name: "active_account_id", type: "string", isOptional: true },
          ],
        }),
      ],
    },
  ],
});

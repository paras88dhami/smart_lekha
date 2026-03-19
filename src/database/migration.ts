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
            { name: "active_profile_id", type: "string", isOptional: true, isIndexed: true },
            { name: "last_selected_country_iso", type: "string", isOptional: true },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),

        createTable({
          name: "auth_session",
          columns: [
            { name: "account_id", type: "string", isOptional: true, isIndexed: true },
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
            { name: "business_category_id", type: "string", isOptional: true, isIndexed: true },
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
  ],
});

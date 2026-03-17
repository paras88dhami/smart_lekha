import { KhataDatabase } from "@/shared/database/khata.database";

export function createMockKhataDatabase(): KhataDatabase {
  return {
    languages: [
      { id: "en", title: "English", nativeTitle: "English" },
      { id: "ne", title: "Nepali", nativeTitle: "नेपाली" },
      { id: "bn", title: "Bangla", nativeTitle: "বাংলা" },
    ],
    profiles: [
      {
        id: "business",
        name: "online clothing brand",
        subtitle: "Business • Admin",
        initials: "OC",
        type: "business",
      },
      {
        id: "personal",
        name: "paras dhami",
        subtitle: "Personal",
        initials: "PD",
        type: "personal",
      },
    ],
    shortcuts: [
      {
        id: "add-party",
        title: "Add Party",
        iconName: "person-add-outline",
        iconFamily: "ion",
      },
      {
        id: "sales-invoice",
        title: "Sales Invoice",
        iconName: "pricetag-outline",
        iconFamily: "ion",
      },
      {
        id: "payment-in",
        title: "Payment In",
        iconName: "wallet-outline",
        iconFamily: "ion",
      },
      {
        id: "payment-out",
        title: "Payment Out",
        iconName: "card-outline",
        iconFamily: "ion",
      },
      {
        id: "purchase",
        title: "Purchase",
        iconName: "cart-outline",
        iconFamily: "ion",
      },
      {
        id: "add-item",
        title: "Add Item",
        iconName: "cube-outline",
        iconFamily: "ion",
      },
      {
        id: "expense",
        title: "Expense",
        iconName: "cash-outline",
        iconFamily: "ion",
      },
    ],
    features: [
      {
        id: "quick-entry",
        title: "Quick Entry",
        iconName: "calculator-outline",
        iconFamily: "ion",
      },
      {
        id: "quick-pos",
        title: "Quick POS",
        iconName: "desktop-outline",
        iconFamily: "ion",
        badge: "New",
      },
      {
        id: "reports",
        title: "Reports",
        iconName: "stats-chart-outline",
        iconFamily: "ion",
      },
    ],
    parties: [
      {
        id: "ranju",
        name: "ranju",
        phone: "9765567858",
        balanceValue: "Rs. 5,000",
        balanceLabel: "To Receive",
      },
    ],
    moreRows: [
      {
        id: "cash-bank",
        title: "Cash & Bank Accounts",
        iconName: "business-outline",
        iconFamily: "ion",
        badge: "New",
      },
      {
        id: "view-reports",
        title: "View Reports",
        iconName: "bar-chart-outline",
        iconFamily: "ion",
      },
      {
        id: "settings",
        title: "Settings",
        iconName: "settings-outline",
        iconFamily: "ion",
      },
      {
        id: "bill-gallery",
        title: "Bill Gallery",
        iconName: "images-outline",
        iconFamily: "ion",
        badge: "New",
      },
      {
        id: "notebook",
        title: "Notebook",
        iconName: "document-text-outline",
        iconFamily: "ion",
        badge: "New",
      },
      {
        id: "support",
        title: "Help and Support",
        iconName: "headset-outline",
        iconFamily: "ion",
      },
    ],
    accountRows: [
      { id: "cash", title: "Cash", amount: "Rs. 10,000" },
      { id: "wallet", title: "paras dhami", amount: "Rs. 1,000" },
    ],
    reportRows: [
      {
        id: "all-transactions",
        title: "All Transactions Report",
        iconName: "cash-outline",
      },
      {
        id: "party-statement",
        title: "Party Statement",
        iconName: "people-outline",
      },
      {
        id: "cash-statement",
        title: "Cash In Hand Statement",
        iconName: "wallet-outline",
      },
      {
        id: "bank-statement",
        title: "Bank Statement",
        iconName: "business-outline",
      },
      {
        id: "parties-report",
        title: "Parties Report",
        iconName: "people-circle-outline",
      },
      {
        id: "income-expense",
        title: "Income Expense Report",
        iconName: "pie-chart-outline",
      },
    ],
  };
}

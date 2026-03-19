const en = {
  common: {
    brand: "e Lekha",
    continue: "Continue",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
  },
  auth: {
    languageSelection: {
      title: "Select Language",
      subtitle: "You can change it later from settings",
      english: "English",
      nepali: "Nepali",
      hindi: "Hindi",
    },
    login: {
      title: "Login",
      phoneNumber: "Phone Number",
      password: "Password",
    },
    phoneEntry: {
      title: "Let's Get Started",
      subtitle: "Please enter phone number to continue",
      countryLabel: "Select Country",
      languageLabel: "Select Language",
      placeholder: "9XXXXXXXXX",
      footer: "By continuing, you agree to our Terms of Use & Privacy Policy.",
    },
    downloadData: {
      title: "Download Data",
    },
    selectProfile: {
      title: "Create Profile",
      subtitle: "Choose profile type and add a profile name",
      businessTitle: "Business Profile",
      businessSubtitle: "Best for shops, companies and registered businesses",
      personalTitle: "Personal and Family",
      personalSubtitle: "Best for individual bookkeeping",
      nameLabel: "Profile Name",
      namePlaceholder: "Enter profile name",
      categoryLabel: "Business Category",
      categoryPlaceholder: "Select business category",
      categorySearchPlaceholder: "Search category",
      categoryNoResult: "No matching category found.",
      validationProfileName: "Profile name must be at least 2 characters.",
      validationBusinessCategory: "Please select a business category.",
    },
  },
  settings: {
    title: "Settings",
    language: "Language",
  },
  tabs: {
    home: "Home",
    transactions: "Transactions",
    parties: "Parties",
    inventory: "Inventory",
    more: "More",
  },
  errors: {
    auth: {
      database: "An error occurred while accessing auth data.",
      appSettingNotFound: "App setting was not found.",
      invalidLanguageCode: "The selected language code is invalid.",
      profileNotFound: "The requested profile was not found.",
      fallback: "Something went wrong. Please try again.",
    },
  },
} as const;

export default en;

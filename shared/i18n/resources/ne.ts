const ne = {
  common: {
    brand: "ई-लेखा",
    continue: "जारी राख्नुहोस्",
    save: "सेभ गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    delete: "मेटाउनुहोस्",
    edit: "सम्पादन गर्नुहोस्",
    loading: "लोड हुँदैछ...",
  },
  auth: {
    languageSelection: {
      brand: "स्मार्ट लेखा",
      title: "भाषा छान्नुहोस्",
      subtitle: "तपाईं यसलाई पछि सेटिङबाट परिवर्तन गर्न सक्नुहुन्छ",
      english: "अंग्रेजी",
      nepali: "नेपाली",
      hindi: "हिन्दी",
      continue: "जारी राख्नुहोस्",
    },
    login: {
      title: "लगइन",
      phoneNumber: "फोन नम्बर",
      password: "पासवर्ड",
    },
    phoneEntry: {
      title: "सुरु गरौँ",
      subtitle: "अगाडि बढ्न कृपया फोन नम्बर प्रविष्ट गर्नुहोस्",
      placeholder: "9XXXXXXXXX",
      footer:
        "जारी राखेर, तपाईं हाम्रो प्रयोगका सर्तहरू र गोपनीयता नीतिसँग सहमत हुनुहुन्छ।",
    },
    downloadData: {
      title: "डाटा डाउनलोड",
    },
    selectProfile: {
      title: "प्रोफाइल छान्नुहोस्",
    },
  },
  settings: {
    title: "सेटिङ",
    language: "भाषा",
  },
  tabs: {
    home: "होम",
    transactions: "कारोबार",
    parties: "पार्टीहरू",
    inventory: "मौज्दात",
    more: "थप",
  },
  errors: {
    auth: {
      database: "प्रमाणीकरण डेटा पहुँच गर्दा त्रुटि भयो।",
      appSettingNotFound: "एप सेटिङ फेला परेन।",
      invalidLanguageCode: "चयन गरिएको भाषा कोड अमान्य छ।",
      profileNotFound: "मागिएको प्रोफाइल फेला परेन।",
      fallback: "केही समस्या भयो। कृपया फेरि प्रयास गर्नुहोस्।",
    },
  },
} as const;

export default ne;

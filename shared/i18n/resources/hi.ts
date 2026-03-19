const hi = {
  common: {
    brand: "ई-लेखा",
    continue: "जारी रखें",
    save: "सेव करें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    loading: "लोड हो रहा है...",
  },
  auth: {
    languageSelection: {
      brand: "स्मार्ट लेखा",
      title: "भाषा चुनें",
      subtitle: "आप इसे बाद में सेटिंग्स से बदल सकते हैं",
      english: "अंग्रेज़ी",
      nepali: "नेपाली",
      hindi: "हिंदी",
      continue: "जारी रखें",
    },
    login: {
      title: "लॉगिन",
      phoneNumber: "फोन नंबर",
      password: "पासवर्ड",
    },
    phoneEntry: {
      title: "चलिए शुरू करते हैं",
      subtitle: "आगे बढ़ने के लिए कृपया फ़ोन नंबर दर्ज करें",
      placeholder: "9XXXXXXXXX",
      footer:
        "जारी रखकर, आप हमारी उपयोग की शर्तों और गोपनीयता नीति से सहमत होते हैं।",
    },
    downloadData: {
      title: "डेटा डाउनलोड",
    },
    selectProfile: {
      title: "प्रोफाइल चुनें",
    },
  },
  settings: {
    title: "सेटिंग्स",
    language: "भाषा",
  },
  tabs: {
    home: "होम",
    transactions: "लेनदेन",
    parties: "पार्टियाँ",
    inventory: "इन्वेंटरी",
    more: "अधिक",
  },
  errors: {
    auth: {
      database: "प्रमाणीकरण डेटा तक पहुंचते समय त्रुटि हुई।",
      appSettingNotFound: "ऐप सेटिंग नहीं मिली।",
      invalidLanguageCode: "चयनित भाषा कोड अमान्य है।",
      profileNotFound: "मांगी गई प्रोफाइल नहीं मिली।",
      fallback: "कुछ गलत हुआ। कृपया फिर से प्रयास करें।",
    },
  },
} as const;

export default hi;

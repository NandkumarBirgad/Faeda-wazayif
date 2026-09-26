import type { Language } from "@/store/language.store"

/**
 * City localization dictionary (Arabic, English, Hindi).
 */
const CITY_TRANSLATIONS: Record<string, { en: string; hi: string; ar: string }> = {
  "الرياض": { en: "Riyadh", hi: "रियाद", ar: "الرياض" },
  "riyadh": { en: "Riyadh", hi: "रियाद", ar: "الرياض" },
  "جدة": { en: "Jeddah", hi: "जेद्दा", ar: "جدة" },
  "jeddah": { en: "Jeddah", hi: "जेद्दा", ar: "جدة" },
  "الظهران": { en: "Dhahran", hi: "धारान", ar: "الظهران" },
  "dhahran": { en: "Dhahran", hi: "धारान", ar: "الظهران" },
  "نيوم": { en: "NEOM", hi: "नियोम", ar: "نيوم" },
  "neom": { en: "NEOM", hi: "नियोम", ar: "نيوم" },
  "الدمام": { en: "Dammam", hi: "दम्माम", ar: "الدمام" },
  "dammam": { en: "Dammam", hi: "दम्माम", ar: "الدمام" },
  "الخبر": { en: "Khobar", hi: "अल-खोबार", ar: "الخبر" },
  "khobar": { en: "Khobar", hi: "अल-खोबार", ar: "الخبر" },
  "مكة المكرمة": { en: "Makkah", hi: "मक्का", ar: "مكة المكرمة" },
  "المدينة المنورة": { en: "Madinah", hi: "मदीना", ar: "المدينة المنورة" },
  "عن بعد": { en: "Remote", hi: "रिमोट", ar: "عن بعد" },
  "remote": { en: "Remote", hi: "रिमोट", ar: "عن بعد" },
}

export function getLocalizedCity(city: string | null | undefined, lang: Language): string {
  if (!city) return lang === "en" ? "Saudi Arabia" : lang === "hi" ? "सऊदी अरब" : "المملكة العربية السعودية"
  const clean = city.trim().toLowerCase()
  for (const [key, val] of Object.entries(CITY_TRANSLATIONS)) {
    if (clean.includes(key.toLowerCase())) {
      return val[lang] || val.en
    }
  }
  return city
}

/**
 * Returns company name localized by language preference with fallback.
 */
export function getLocalizedCompanyName(
  company: { company_arabic_name?: string; company_english_name?: string; name?: string } | undefined | null,
  lang: Language
): string {
  if (!company) {
    if (lang === "en") return "Company"
    if (lang === "hi") return "कंपनी"
    return "شركة"
  }
  const raw = (company.name || company.company_arabic_name || company.company_english_name || "").toLowerCase()

  if (raw.includes("أرامكو") || raw.includes("aramco")) {
    return lang === "en" ? "Aramco Digital" : lang === "hi" ? "अरामको डिजिटल" : "أرامكو الرقمية"
  }
  if (raw.includes("سدايا") || raw.includes("sdaia")) {
    return lang === "en" ? "SDAIA" : lang === "hi" ? "सडाया (SDAIA)" : "الهيئة السعودية للبيانات والذكاء الاصطناعي"
  }
  if (raw.includes("stc") || raw.includes("اتصالات")) {
    return lang === "en" ? "stc Group" : lang === "hi" ? "एसटीसी समूह (stc)" : "شركة الاتصالات السعودية (stc)"
  }
  if (raw.includes("نيوم") || raw.includes("neom")) {
    return lang === "en" ? "NEOM" : lang === "hi" ? "नियोम (NEOM)" : "نيوم"
  }
  if (raw.includes("هنقرستيشن") || raw.includes("hungerstation")) {
    return lang === "en" ? "HungerStation" : lang === "hi" ? "हंगरस्टेशन" : "هنقرستيشن"
  }
  if (raw.includes("علم") || raw.includes("elm")) {
    return lang === "en" ? "Elm" : lang === "hi" ? "एल्म" : "شركة علم"
  }
  if (raw.includes("راجحي") || raw.includes("rajhi")) {
    return lang === "en" ? "Al Rajhi Bank" : lang === "hi" ? "अल राजी बैंक" : "مصرف الراجحي"
  }
  if (raw.includes("جاهز") || raw.includes("jahez")) {
    return lang === "en" ? "Jahez" : lang === "hi" ? "जाहेज़" : "جاهز الدولية"
  }
  if (raw.includes("لوسيد") || raw.includes("lucid")) {
    return lang === "en" ? "Lucid Motors" : lang === "hi" ? "ल्यूसिड मोटर्स" : "لوسيد موتورز"
  }
  if (raw.includes("تابي") || raw.includes("tabby")) {
    return lang === "en" ? "Tabby" : lang === "hi" ? "टैबी" : "تابي"
  }
  if (raw.includes("تمارا") || raw.includes("tamara")) {
    return lang === "en" ? "Tamara" : lang === "hi" ? "तमारा" : "تمارا"
  }
  if (raw.includes("ثقة") || raw.includes("thiqah")) {
    return lang === "en" ? "Thiqah Business Solutions" : lang === "hi" ? "सिका बिजनेस सॉल्यूशंस" : "شركة ثقة لخدمات الأعمال"
  }

  if (lang === "en" && company.company_english_name?.trim()) return company.company_english_name.trim()
  if (lang === "ar" && company.company_arabic_name?.trim()) return company.company_arabic_name.trim()
  if (company.name?.trim()) return company.name.trim()

  return lang === "en" ? "Company" : lang === "hi" ? "कंपनी" : "شركة"
}

/**
 * Maps database work_type / job_type enums to localized strings.
 */
export function getLocalizedWorkType(workType: string | null | undefined, lang: Language): string {
  if (!workType) {
    if (lang === "en") return "Full-time"
    if (lang === "hi") return "पूर्णकालिक"
    return "دوام كامل"
  }
  const clean = workType.trim().toLowerCase()

  if (clean.includes("كامل") || clean.includes("full")) {
    if (lang === "en") return "Full-time"
    if (lang === "hi") return "पूर्णकालिक"
    return "دوام كامل"
  }
  if (clean.includes("جزئي") || clean.includes("part")) {
    if (lang === "en") return "Part-time"
    if (lang === "hi") return "अंशकालिक"
    return "دوام جزئي"
  }
  if (clean.includes("عن بعد") || clean.includes("remote")) {
    if (lang === "en") return "Remote"
    if (lang === "hi") return "रिमोट"
    return "عن بعد"
  }
  if (clean.includes("هجين") || clean.includes("hybrid")) {
    if (lang === "en") return "Hybrid"
    if (lang === "hi") return "हाइब्रिड"
    return "هجين"
  }
  if (clean.includes("عقد") || clean.includes("contract")) {
    if (lang === "en") return "Contract"
    if (lang === "hi") return "अनुबंध"
    return "عقد"
  }

  return workType
}

/**
 * Maps experience levels to localized strings.
 */
export function getLocalizedExperienceLevel(level: string | null | undefined, lang: Language): string {
  if (!level) {
    if (lang === "en") return "Mid level"
    if (lang === "hi") return "मध्यम स्तर"
    return "مستوى متوسط"
  }
  const clean = level.trim().toLowerCase()

  if (clean.includes("مبتدئ") || clean.includes("entry")) {
    if (lang === "en") return "Entry level"
    if (lang === "hi") return "प्रारंभिक स्तर"
    return "مبتدئ"
  }
  if (clean.includes("متوسط") || clean.includes("mid")) {
    if (lang === "en") return "Mid level"
    if (lang === "hi") return "मध्यम स्तर"
    return "متوسط"
  }
  if (clean.includes("أول") || clean.includes("senior")) {
    if (lang === "en") return "Senior"
    if (lang === "hi") return "वरिष्ठ"
    return "أول"
  }
  if (clean.includes("قيادي") || clean.includes("lead")) {
    if (lang === "en") return "Lead"
    if (lang === "hi") return "नेतृत्व"
    return "قيادي"
  }
  if (clean.includes("تنفيذي") || clean.includes("executive")) {
    if (lang === "en") return "Executive"
    if (lang === "hi") return "कार्यकारी"
    return "تنفيذي"
  }

  return level
}

/**
 * Formats numbers according to the active locale using Intl.NumberFormat.
 */
export function formatLocalizedNumber(num: number, lang: Language): string {
  try {
    const localeCode = lang === "ar" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US"
    return new Intl.NumberFormat(localeCode).format(num)
  } catch {
    return String(num)
  }
}

/**
 * Formats salary range with local currency symbol.
 */
export function formatLocalizedSalary(
  min: number | null | undefined,
  max: number | null | undefined,
  lang: Language
): string {
  if (!min && !max) {
    if (lang === "en") return "Salary undisclosed"
    if (lang === "hi") return "वेतन का खुलासा नहीं किया गया"
    return "الراتب غير محدد"
  }

  const minFormatted = min ? formatLocalizedNumber(min, lang) : null
  const maxFormatted = max ? formatLocalizedNumber(max, lang) : null

  if (minFormatted && maxFormatted) {
    if (lang === "en" || lang === "hi") {
      return `SAR ${minFormatted} - ${maxFormatted}`
    }
    return `${minFormatted} - ${maxFormatted} ر.س`
  }

  const single = minFormatted || maxFormatted
  if (lang === "en" || lang === "hi") {
    return `SAR ${single}`
  }
  return `${single} ر.س`
}

/**
 * Formats relative date or ISO date string according to locale.
 */
export function formatLocalizedDate(dateString: string | null | undefined, lang: Language): string {
  if (!dateString) return ""
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    const localeCode = lang === "ar" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US"
    return new Intl.DateTimeFormat(localeCode, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d)
  } catch {
    return dateString
  }
}

/* ═══════════════════════════════════════════════════════════════
   DYNAMIC CONTENT LOCALIZATION DICTIONARIES (AR / EN / HI)
   ═══════════════════════════════════════════════════════════════ */

interface JobLocalizationPack {
  title: { en: string; hi: string; ar: string }
  excerpt: { en: string; hi: string; ar: string }
  description?: { en: string; hi: string; ar: string }
  responsibilities?: { en: string[]; hi: string[]; ar: string[] }
  requirements?: { en: string[]; hi: string[]; ar: string[] }
}

const JOB_TRANSLATIONS: Record<string, JobLocalizationPack> = {
  "1": {
    title: {
      en: "Senior Frontend & Web Systems Engineer",
      hi: "वरिष्ठ फ्रंटएंड और वेब सिस्टम इंजीनियर",
      ar: "مهندس برمجيات واجهات أمامية أول",
    },
    excerpt: {
      en: "Lead frontend engineering for energy digital solutions using React, TypeScript, and state-of-the-art Design Systems.",
      hi: "React, TypeScript और अत्याधुनिक डिज़ाइन सिस्टम का उपयोग करके ऊर्जा डिजिटल समाधानों के लिए फ्रंटएंड इंजीनियरिंग का नेतृत्व करें।",
      ar: "قيادة تطوير الواجهات التفاعلية لمنظومات الطاقة والصناعة الرقمية بأحدث تقنيات React و TypeScript مع مراعاة الأداء وسهولة الوصول.",
    },
    description: {
      en: "Aramco Digital is seeking a Senior Frontend Engineer to architect high-performance, resilient web interfaces for enterprise energy intelligence platforms.",
      hi: "अरामको डिजिटल एंटरप्राइज ऊर्जा इंटेलिजेंस प्लेटफॉर्म के लिए उच्च प्रदर्शन और लचीले वेब इंटरफेस के निर्माण हेतु वरिष्ठ फ्रंटएंड इंजीनियर की तलाश कर रहा है।",
      ar: "نبحث في أرامكو الرقمية عن مهندس واجهات أمامية أول للانضمام إلى فريق الحلول السحابية المتقدمة لبناء تطبيقات ويب فائقة السرعة والأمان.",
    },
    responsibilities: {
      en: [
        "Architect and develop reusable UI components compliant with enterprise design systems.",
        "Optimize web performance, Core Web Vitals, and load times by at least 30%.",
        "Conduct peer code reviews and mentor junior and mid-level software engineers.",
        "Integrate with GraphQL and REST APIs with robust state management.",
      ],
      hi: [
        "एंटरप्राइज डिज़ाइन सिस्टम के अनुरूप पुन: प्रयोज्य यूआई घटकों का निर्माण करें।",
        "वेब प्रदर्शन, कोर वेब वाइटल्स और लोड समय में कम से कम 30% सुधार करें।",
        "कोड समीक्षा करें और कनिष्ठ व मध्यम स्तर के सॉफ्टवेयर इंजीनियरों का मार्गदर्शन करें।",
        "मजबूत स्टेट मैनेजमेंट के साथ GraphQL और REST APIs को एकीकृत करें।",
      ],
      ar: [
        "تصميم وتطوير مكونات واجهة مستخدم قابلة لإعادة الاستخدام وفق أحدث معايير Design Systems.",
        "تحسين أداء الواجهات وسرعة التحميل بنسبة لا تقل عن 30% وضمان تجربة سلسة.",
        "مراجعة الأكواد البرمجية (Code Review) وتوجيه المطورين في الفريق.",
        "التكامل مع خدمات GraphQL و REST APIs ومراعاة إدارة الحالة المتقدمة.",
      ],
    },
    requirements: {
      en: [
        "5+ years of production experience in React, TypeScript, and modern CSS architectures.",
        "Strong understanding of Next.js, Server Components, and SEO optimization.",
        "Proficiency in automated frontend testing with Jest, React Testing Library, and Playwright.",
        "Bachelor's degree in Computer Science, Software Engineering, or equivalent experience.",
      ],
      hi: [
        "React, TypeScript और आधुनिक CSS आर्किटेक्चर में 5+ वर्षों का व्यावहारिक अनुभव।",
        "Next.js, सर्वर घटकों और एसईओ अनुकूलन की गहरी समझ।",
        "Jest और Playwright के साथ स्वचालित टेस्टिंग में प्रवीणता।",
        "कंप्यूटर साइंस, सॉफ्टवेयर इंजीनियरिंग में स्नातक या समकक्ष अनुभव।",
      ],
      ar: [
        "خبرة عملية لا تقل عن 5 سنوات في تطوير الواجهات الأمامية باستخدام React و TypeScript.",
        "فهم عميق لمبادئ Next.js، Server Components، وتقنيات تحسين محركات البحث SEO.",
        "خبرة مثبتة في كتابة اختبارات الواجهات الأوتوماتيكية باستخدام Jest و Playwright.",
        "شهادة جامعية في علوم الحاسب أو الهندسة أو خبرة عملية مكافئة.",
      ],
    },
  },
  "2": {
    title: {
      en: "AI & Large Language Models (LLM) Engineer",
      hi: "एआई और लार्ज लैंग्वेज मॉडल (LLM) इंजीनियर",
      ar: "مهندس ذكاء اصطناعي ونماذج لغوية (AI & LLM)",
    },
    excerpt: {
      en: "Develop, fine-tune, and deploy Arabic LLMs and generative AI solutions for national-scale digital infrastructure.",
      hi: "राष्ट्रीय स्तर के डिजिटल इंफ्रास्ट्रक्चर के लिए अरबी एलएलएम और जेनरेटिव एआई समाधान विकसित और फाइन-ट्यून करें।",
      ar: "تطوير وتدريب النماذج اللغوية الكبيرة المتخصصة في اللغة العربية وتطبيقات الذكاء الاصطناعي التوليدي لخدمة الجهات الوطنية.",
    },
    description: {
      en: "Pioneering opportunity at SDAIA to advance national AI capabilities. Train, benchmark, and deploy Arabic generative foundation models.",
      hi: "राष्ट्रीय एआई क्षमताओं को आगे बढ़ाने के लिए सडाया (SDAIA) में अग्रणी अवसर। अरबी जनरेटिव फाउंडेशन मॉडल को प्रशिक्षित और तैनात करें।",
      ar: "فرصة رائدة في سدايا (SDAIA) للمساهمة في بناء المستقبل الرقمي وتطوير وتدريب وضبط النماذج اللغوية العربية الضخمة.",
    },
    responsibilities: {
      en: [
        "Train and fine-tune large generative language models using PyTorch and distributed GPU clusters.",
        "Build Retrieval-Augmented Generation (RAG) pipelines and vector database integrations.",
        "Optimize inference latency using vLLM and TensorRT-LLM frameworks.",
      ],
      hi: [
        "PyTorch और वितरित जीपीयू क्लस्टर का उपयोग करके बड़े भाषा मॉडल को फाइन-ट्यून करें।",
        "आरएजी (RAG) पाइपलाइन और वेक्टर डेटाबेस एकीकरण का निर्माण करें।",
        "vLLM और TensorRT-LLM का उपयोग करके अनुमान विलंबता (Latency) को अनुकूलित करें।",
      ],
      ar: [
        "بناء مسارات تدريب وضبط النماذج اللغوية المتقدمة (Fine-tuning & RLHF).",
        "تطوير حلول استرجاع المعلومات المعزز بالتوليد (RAG) وقواعد البيانات الشعاعية.",
        "نشر النماذج واستضافتها بكفاءة عبر أطر عمل vLLM و TensorRT-LLM لتقليل زمن الاستجابة.",
      ],
    },
    requirements: {
      en: [
        "4+ years in Deep Learning, NLP, and Python MLOps pipelines.",
        "Hands-on experience with Hugging Face transformers, LangChain, and vector embeddings.",
        "Degree in AI, Computer Science, or Data Science.",
      ],
      hi: [
        "डीप लर्निंग, एनएलपी और पायथन MLOps में 4+ वर्षों का अनुभव।",
        "Hugging Face ट्रांसफॉर्मर्स और LangChain के साथ व्यावहारिक अनुभव।",
        "एआई, कंप्यूटर साइंस या डेटा साइंस में डिग्री।",
      ],
      ar: [
        "خبرة 4+ سنوات في التعلم العميق والذكاء الاصطناعي ومعالجة اللغات الطبيعية (NLP).",
        "إتقان Python و PyTorch وخبرة عملية في استخدام مكتبات Hugging Face و LangChain.",
        "درجة البكالوريوس أو الماجستير في الذكاء الاصطناعي أو علوم البيانات.",
      ],
    },
  },
  "3": {
    title: {
      en: "Cloud Solutions & DevOps Architect",
      hi: "क्लाउड सॉल्यूशंस और डेवऑप्स आर्किटेक्ट",
      ar: "مهندس حلول سحابية وديف أوبس",
    },
    excerpt: {
      en: "Architect and manage mission-critical multi-cloud telecom infrastructure ensuring 99.99% uptime.",
      hi: "99.99% अपटाइम सुनिश्चित करने वाले महत्वपूर्ण मल्टी-क्लाउड टेलीकॉम इंफ्रास्ट्रक्चर का डिजाइन और प्रबंधन करें।",
      ar: "تصميم وإدارة البنى السحابية الموزعة لمنصات الاتصالات الرقمية، وضمان توافرية 99.99% عبر السحب الهجينة.",
    },
  },
  "4": {
    title: {
      en: "Senior Product UI/UX Designer",
      hi: "वरिष्ठ उत्पाद UI/UX डिज़ाइनर",
      ar: "مصمم تجربة وواجهة المستخدم",
    },
    excerpt: {
      en: "Create world-class digital experiences for the futuristic smart cities of NEOM.",
      hi: "नियोम (NEOM) के भविष्य के स्मार्ट शहरों के लिए विश्व स्तरीय डिजिटल अनुभव बनाएं।",
      ar: "ابتكار تجارب رقمية استثنائية لمدن المستقبل في نيوم، وبناء أنظمة تصميم تفاعلية تواكب أعلى المعايير العالمية.",
    },
  },
  "5": {
    title: {
      en: "Distributed Backend Engineer (Go / Python)",
      hi: "डिस्ट्रिब्यूटेड बैकएंड इंजीनियर (Go / Python)",
      ar: "مطور خادم وأنظمة موزعة (Go / Python)",
    },
    excerpt: {
      en: "Build ultra-low-latency backend microservices handling thousands of real-time delivery transactions per second.",
      hi: "प्रति सेकंड हजारों डिलीवरी लेनदेन को संभालने वाले अल्ट्रा-फास्ट बैकएंड माइक्रोसर्विसेज का निर्माण करें।",
      ar: "بناء وتطوير الخدمات الخلفية فائقة السرعة لمنصة التوصيل للتعامل مع آلاف العمليات في الثانية.",
    },
  },
  "6": {
    title: {
      en: "Cybersecurity & Incident Response Analyst",
      hi: "साइबर सुरक्षा और इंसिडेंट रिस्पॉन्स विश्लेषक",
      ar: "محلل أمن سيبراني واستجابة للحوادث",
    },
    excerpt: {
      en: "Safeguard vital enterprise infrastructure, monitor threat telemetry in SOC, and manage rapid cyber responses.",
      hi: "महत्वपूर्ण डिजिटल इंफ्रास्ट्रक्चर की रक्षा करें, SOC में खतरों की निगरानी करें और त्वरित प्रतिक्रिया दें।",
      ar: "حماية الأنظمة والمنصات الحساسة، ورصد التهديدات السيبرانية والاستجابة الفورية للحوادث الأمنية.",
    },
  },
  "7": {
    title: {
      en: "Digital FinTech Product Manager",
      hi: "डिजिटल फिनटेक प्रोडक्ट मैनेजर",
      ar: "مدير منتجات التقنية المالية",
    },
    excerpt: {
      en: "Lead product roadmaps and customer experience for digital banking and open-finance ecosystems.",
      hi: "डिजिटल बैंकिंग और ओपन-फाइनेंस के लिए उत्पाद रोडमैप और ग्राहक अनुभव का नेतृत्व करें।",
      ar: "قيادة استراتيجية المنتجات المصرفية الرقمية وتطوير تجربة العملاء في أكبر مصرف إسلامي.",
    },
  },
  "8": {
    title: {
      en: "Mobile App Developer (Flutter)",
      hi: "मोबाइल ऐप डेवलपर (Flutter)",
      ar: "مطور تطبيقات الهواتف الذكية (Flutter)",
    },
    excerpt: {
      en: "Craft fast, delightful iOS and Android mobile experiences with live maps, routing, and instant payments.",
      hi: "लाइव मैप्स, रूटिंग और त्वरित भुगतान के साथ शानदार iOS और Android मोबाइल अनुभव तैयार करें।",
      ar: "تطوير تطبيقات الجوال لخدمة ملايين العملاء والشركاء، وبناء تجارب سلسة وسريعة مع خرائط ودفع فوري.",
    },
  },
  "9": {
    title: {
      en: "Electric Vehicle Embedded Systems Engineer",
      hi: "इलेक्ट्रिक वाहन एम्बेडेड सिस्टम इंजीनियर",
      ar: "مهندس نظم سيارات كهربائية مدمجة",
    },
    excerpt: {
      en: "Develop battery management software (BMS) and electronic control units for luxury electric vehicles.",
      hi: "लक्जरी इलेक्ट्रिक वाहनों के लिए बैटरी प्रबंधन सॉफ्टवेयर (BMS) और इलेक्ट्रॉनिक नियंत्रण इकाइयों का विकास करें।",
      ar: "برمجة وحدات التحكم الإلكترونية وإدارة بطاريات السيارات الكهربائية في أول مصنع للسيارات بالمملكة.",
    },
  },
  "10": {
    title: {
      en: "Senior Data Platform Engineer",
      hi: "वरिष्ठ डेटा प्लेटफॉर्म इंजीनियर",
      ar: "مهندس بيانات ومنصات تحليلية",
    },
    excerpt: {
      en: "Scale enterprise data lakes, streaming pipelines, and real-time risk assessment platforms.",
      hi: "एंटरप्राइज डेटा लेक, स्ट्रीमिंग पाइपलाइन और रीयल-टाइम रिस्क असेसमेंट प्लेटफॉर्म का विस्तार करें।",
      ar: "تصميم وإدارة مستودعات وبحيرات البيانات الضخمة لدعم قرارات الشراء والائتمان الفوري.",
    },
  },
  "11": {
    title: {
      en: "Growth & Performance Marketing Specialist",
      hi: "ग्रोथ और परफॉर्मेंस मार्केटिंग विशेषज्ञ",
      ar: "أخصائي تسويق رقمي واكتساب مستخدمين",
    },
    excerpt: {
      en: "Drive high-impact user acquisition campaigns, attribution funnels, and data-driven marketing.",
      hi: "डेटा-संचालित मार्केटिंग, रूपांतरण फनल और उच्च-प्रभाव वाले यूजर अधिग्रहण अभियानों का संचालन करें।",
      ar: "إدارة وتوسيع حملات الاستحواذ الرقمي وتحليل مسارات التحويل في أول يونيكورن تقني مالي سعودي.",
    },
  },
  "12": {
    title: {
      en: "Full-Stack Software Engineer (Python / React)",
      hi: "फुल-स्टैक सॉफ्टवेयर इंजीनियर (Python / React)",
      ar: "مطور برمجيات شامل (Full-Stack)",
    },
    excerpt: {
      en: "Build reliable, scalable web applications and REST APIs serving thousands of commercial and government users.",
      hi: "हजारों वाणिज्यिक और सरकारी उपयोगकर्ताओं की सेवा करने वाले विश्वसनीय वेब अनुप्रयोगों का निर्माण करें।",
      ar: "المساهمة في بناء وتحديث المنظومات والمنصات الذكية التي تخدم قطاع الأعمال والجهات الحكومية في المملكة.",
    },
  },
}

/**
 * Localizes any Job object based on current selected language.
 */
export function getLocalizedJob<T extends {
  id: string
  title: string
  location: string
  excerpt?: string | null
  description?: string
  responsibilities?: string[]
  requirements?: string[]
  company: { name: string; location?: string | null; [key: string]: any }
}>(job: T, lang: Language): T {
  if (!job) return job
  const pack = JOB_TRANSLATIONS[String(job.id)]

  const localizedTitle = pack ? pack.title[lang] || pack.title.en : job.title
  const localizedExcerpt = pack ? pack.excerpt[lang] || pack.excerpt.en : job.excerpt
  const localizedLocation = getLocalizedCity(job.location, lang)
  const localizedCompany = {
    ...job.company,
    name: getLocalizedCompanyName(job.company, lang),
    location: getLocalizedCity(job.company.location, lang),
  }

  const localizedDesc = pack?.description ? pack.description[lang] || pack.description.en : job.description
  const localizedResp = pack?.responsibilities ? pack.responsibilities[lang] || pack.responsibilities.en : job.responsibilities
  const localizedReq = pack?.requirements ? pack.requirements[lang] || pack.requirements.en : job.requirements

  return {
    ...job,
    title: localizedTitle,
    excerpt: localizedExcerpt,
    location: localizedLocation,
    company: localizedCompany,
    description: localizedDesc,
    responsibilities: localizedResp,
    requirements: localizedReq,
  }
}

/* ═══════════════════════════════════════════════════════════════
   POSTS / BLOG LOCALIZATION
   ═══════════════════════════════════════════════════════════════ */

interface PostLocalizationPack {
  title: { en: string; hi: string; ar: string }
  summary: { en: string; hi: string; ar: string }
  category: { en: string; hi: string; ar: string }
  readTime: { en: string; hi: string; ar: string }
  authorTitle?: { en: string; hi: string; ar: string }
  authorName?: { en: string; hi: string; ar: string }
  content?: { en: string; hi: string; ar: string }
}

const POST_TRANSLATIONS: Record<string, PostLocalizationPack> = {
  "1": {
    title: {
      en: "The Comprehensive Guide to Passing ATS Filters & Landing High-Impact Interviews",
      hi: "एटीएस (ATS) फ़िल्टर पास करने और इंटरव्यू हासिल करने की संपूर्ण मार्गदर्शिका",
      ar: "دليلك الشامل لاجتياز أنظمة الفرز الذكي (ATS) والوصول إلى المقابلات الشخصية",
    },
    summary: {
      en: "How to craft your resume for AI screening algorithms and recruiters in the Saudi job market: 5 proven strategies.",
      hi: "सऊदी जॉब मार्केट में एआई स्क्रीनिंग और रिक्रूटर्स के लिए अपना रिज्यूमे कैसे तैयार करें: 5 प्रमाणित रणनीतियाँ।",
      ar: "كيف تصيغ سيرتك الذاتية بلغة تفهمها خوارزميات الذكاء الاصطناعي ومسؤولو التوظيف في السوق السعودي؟ 5 استراتيجيات عملية معتمدة.",
    },
    category: {
      en: "ATS & Resumes",
      hi: "बायोडाटा और ATS",
      ar: "السير الذاتية وATS",
    },
    readTime: {
      en: "5 min read",
      hi: "5 मिनट का पठन",
      ar: "5 دقائق قراءة",
    },
    authorName: {
      en: "Ahmed Al-Farsi",
      hi: "अहमद अल-फ़ारसी",
      ar: "أحمد الفارسي",
    },
    authorTitle: {
      en: "Tech Talent Acquisition Expert | Career Advisor",
      hi: "तकनीकी प्रतिभा अधिग्रहण विशेषज्ञ | करियर सलाहकार",
      ar: "خبير استقطاب المواهب التقنية | مستشار مهني",
    },
    content: {
      en: `Today, over 85% of leading enterprises and high-growth scaleups in Saudi Arabia rely on Applicant Tracking Systems (ATS). These platforms parse, score, and rank resumes before a human recruiter ever sees them.

### 1. Avoid Complex Multi-Column Layouts & Embedded Tables
Many job seekers use visually heavy multi-column graphics believing it looks creative. In reality, most ATS parsers fail to parse text in tables, sidebars, or SVG infographics.
- Use clean, single-column layouts with standard readable fonts.
- Keep critical contact information in the body, avoiding header/footer traps.

### 2. Semantic Keyword Optimization
Align your experience directly with the exact terminology in the target job description.
- If the role requires "PostgreSQL" and "FastAPI", mention these tools contextually in past initiatives.
- Weave technical competencies into achievements rather than maintaining an isolated bullet list.

### 3. Quantified Achievements Using the STAR Framework
Instead of "Responsible for frontend UI", specify:
> "Re-architected core web interfaces with React and TypeScript, decreasing page load times by 40% and boosting conversion rates by 18%."
Concrete metrics immediately validate your market value.`,
      hi: `आज सऊदी अरब और अंतरराष्ट्रीय स्तर पर 85% से अधिक बड़ी कंपनियाँ आवेदक ट्रैकिंग सिस्टम (ATS) पर निर्भर हैं।

### 1. जटिल लेआउट और तालिकाओं से बचें
कई उम्मीदवार आकर्षक दिखने के लिए दोहरे कॉलम या टेबल वाले टेम्प्लेट चुनते हैं, जिन्हें कई एटीएस सिस्टम ठीक से पढ़ नहीं पाते।
- एकल-कॉलम (single column) और स्पष्ट फ़ॉन्ट का उपयोग करें।
- संपर्क जानकारी हेडर या पाद लेख (footer) में रखने से बचें।

### 2. महत्वपूर्ण कीवर्ड का स्वाभाविक प्रयोग
जॉब विवरण में उल्लिखित सटीक तकनीकी शब्दों का अपने वास्तविक प्रोजेक्ट्स में उल्लेख करें।

### 3. स्टार (STAR) पद्धति और संख्यात्मक परिणाम
केवल यह लिखने के बजाय कि "यूआई विकसित किया", ठोस आंकड़े लिखें:
> "React और TypeScript के साथ इंटरफ़ेस को फिर से डिज़ाइन किया, जिससे लोड समय 40% कम हुआ और उपयोगकर्ता सहभागिता 18% बढ़ी।"`,
      ar: `تعتمد اليوم أكثر من 85% من كبرى الشركات السعودية والدولية على أنظمة التتبع الآلي للمرشحين (ATS). وظيفة هذه الأنظمة هي فلترة مئات السير الذاتية وفرزها تلقائياً قبل أن تصل إلى عين مسؤول الموارد البشرية.

### 1. ابتعد عن التنسيقات المعقدة والجداول
العديد من الباحثين عن عمل يستخدمون قوالب مليئة بالجداول، الرسوم البيانية والأعمدة المزدوجة ظناً منهم أنها أكثر جاذبية. الحقيقة أن معظم محركات ATS تفشل في قراءة النصوص داخل الجداول أو الصور.
- استخدم قالباً أحادي العمود بخطوط نظامية واضحة.
- تجنب وضع بيانات الاتصال في الترويسة (Header) أو التذييل (Footer).

### 2. التوافق الدلالي مع الكلمات المفتاحية
لا تكتفِ بوضع قائمة مهارات عامة؛ بل ادرس الوصف الوظيفي بدقة.
- إذا طلبت الشركة تقنيات محددة، احرص على ورود هذه المصطلحات حرفياً في سياق مشاريعك السابقة.

### 3. صياغة الإنجازات بنموذج STAR والنتائج الرقمية
الأرقام والنسب هي لغة يثق بها مسؤولو التوظيف وتبرز قيمتك السوقية المضافة.`,
    },
  },
  "2": {
    title: {
      en: "Market Value & Salary Negotiation: Your Guide to a Fair Job Offer in 2026",
      hi: "बाज़ार मूल्य और वेतन वार्ता: 2026 में निष्पक्ष नौकरी प्रस्ताव के लिए मार्गदर्शिका",
      ar: "القيمة السوقية والتفاوض على الرواتب: دليلك لعرض وظيفي عادل في 2026",
    },
    summary: {
      en: "Understand compensation benchmarks in the Saudi market and use data-driven insights to negotiate top job offers.",
      hi: "सऊदी बाज़ार में वेतन मानकों को समझें और बेहतर नौकरी प्रस्तावों के लिए डेटा-संचालित अंतर्दृष्टि का उपयोग करें।",
      ar: "فهم معايير تسعير الكفاءات في السوق السعودي، وكيف تستند على مؤشرات حقيقية لحساب قيمتك السوقية وبناء موقف تفاوضي قوي.",
    },
    category: {
      en: "Market & Salaries",
      hi: "बाज़ार और वेतन",
      ar: "السوق والرواتب",
    },
    readTime: {
      en: "6 min read",
      hi: "6 मिनट का पठन",
      ar: "6 دقائق قراءة",
    },
    authorName: {
      en: "Sara Al-Ghamdi",
      hi: "सारा अल-ग़ामदी",
      ar: "سارة الغامدي",
    },
    authorTitle: {
      en: "Executive Talent Acquisition Lead | HR Advisor",
      hi: "कार्यकारी प्रतिभा अधिग्रहण प्रमुख | मानव संसाधन सलाहकार",
      ar: "رئيسة قسم استقطاب المواهب التنفيذية | مستشارة موارد بشرية",
    },
  },
  "3": {
    title: {
      en: "Team Hiring: Why Modern Enterprises Prefer Pre-Built Technical Squads",
      hi: "सामूहिक भर्ती: आधुनिक कंपनियाँ तैयार तकनीकी टीमों को क्यों प्राथमिकता देती हैं?",
      ar: "التوظيف الجماعي: لماذا تفضل الشركات استقطاب فرق تقنية جاهزة؟",
    },
    summary: {
      en: "A breakthrough in hiring models: cutting onboarding time by 70% with high-synergy cross-functional squads.",
      hi: "भर्ती मॉडल में एक बड़ा बदलाव: ऑनबोर्डिंग समय में 70% की कटौती और उच्च तालमेल वाली टीमों के साथ त्वरित परिणाम।",
      ar: "نقلة نوعية في منهجيات التوظيف الحديثة: تقليل فترة التأهيل بنسبة 70% وتسليم المنتجات بأعلى تناغم وتكامل بين الأعضاء.",
    },
    category: {
      en: "Team Dynamics",
      hi: "टीम वर्क",
      ar: "فرق العمل",
    },
    readTime: {
      en: "4 min read",
      hi: "4 मिनट का पठन",
      ar: "4 دقائق قراءة",
    },
    authorName: {
      en: "Eng. Faisal Al-Shammari",
      hi: "इंजी. फैसल अल-शम्मरी",
      ar: "م. فيصل الشمري",
    },
    authorTitle: {
      en: "Head of Software Engineering & Tech Founder",
      hi: "सॉफ्टवेयर इंजीनियरिंग प्रमुख और तकनीकी संस्थापक",
      ar: "مدير الهندسة البرمجية ومؤسس تقني",
    },
  },
  "4": {
    title: {
      en: "Jobs of the Future: AI Acceleration and Saudi Vision 2030",
      hi: "भविष्य की नौकरियाँ: एआई और सऊदी विज़न 2030",
      ar: "وظائف المستقبل في ظل الذكاء الاصطناعي ورؤية السعودية 2030",
    },
    summary: {
      en: "Strategic analysis of the fastest-growing careers in Saudi Arabia and how to upskill for global-standard opportunities.",
      hi: "सऊदी अरब में सबसे तेजी से बढ़ते करियर क्षेत्रों का विश्लेषण और वैश्विक स्तर के अवसरों के लिए खुद को कैसे तैयार करें।",
      ar: "تحليل لأهم المهن الناشئة والمجالات الاستراتيجية الأكثر نمواً في المملكة، وكيف تؤهل نفسك لتكون ضمن الكفاءات المطلوبة عالمياً.",
    },
    category: {
      en: "Vision 2030",
      hi: "विजन 2030",
      ar: "رؤية 2030",
    },
    readTime: {
      en: "7 min read",
      hi: "7 मिनट का पठन",
      ar: "7 دقائق قراءة",
    },
    authorName: {
      en: "Dr. Abdullah Al-Malki",
      hi: "डॉ. अब्दुल्ला अल-मल्की",
      ar: "د. عبد الله المالكي",
    },
    authorTitle: {
      en: "AI & Digital Transformation Research Advisor",
      hi: "एआई और डिजिटल परिवर्तन अनुसंधान सलाहकार",
      ar: "باحث ومستشار في الذكاء الاصطناعي والتحول الرقمي",
    },
  },
  "5": {
    title: {
      en: "From Junior to Senior Engineer: 7 Non-Taught Core Skills",
      hi: "जूनियर से सीनियर इंजीनियर: 7 महत्वपूर्ण कौशल जो कॉलेजों में नहीं सिखाए जाते",
      ar: "التحول من مطور مبتدئ إلى محترف: 7 مهارات جوهرية لا تُدرس في الجامعات",
    },
    summary: {
      en: "What sets a senior engineer apart is architectural thinking, empathy, maintainability, and strategic business impact.",
      hi: "एक वरिष्ठ इंजीनियर को जो अलग बनाता है वह केवल कोडिंग नहीं, बल्कि आर्किटेक्चरल सोच, संचार और सिस्टम की स्थिरता है।",
      ar: "ما يميز المطور المحترف ليس مجرد كتابة الكود، بل التفكير في البنية المعمارية، التواصل، وقابلية الصيانة والتوسع.",
    },
    category: {
      en: "Career Growth",
      hi: "करियर विकास",
      ar: "التطوير المهني",
    },
    readTime: {
      en: "5 min read",
      hi: "5 मिनट का पठन",
      ar: "5 دقائق قراءة",
    },
    authorName: {
      en: "Noura Al-Otaibi",
      hi: "नूरा अल-ओतैबी",
      ar: "نورة العتيبي",
    },
    authorTitle: {
      en: "Cloud Solutions Architect | Tech Mentor",
      hi: "क्लाउड समाधान आर्किटेक्ट | तकनीकी मेंटर",
      ar: "مهندسة معمارية للبنية السحابية | مرشدة تقنية",
    },
  },
}

export function getLocalizedPost<T extends {
  id: string | number
  title: string
  summary?: string
  content?: string
  category?: string
  readTime?: string
  author?: {
    name: string
    title?: string
    [key: string]: any
  }
  [key: string]: any
}>(post: T, lang: Language): T {
  if (!post) return post

  const pack = POST_TRANSLATIONS[String(post.id)]
  if (!pack) return post

  const localizedTitle = (pack.title as any)[lang] || post.title
  const localizedSummary = (pack.summary as any)[lang] || post.summary
  const localizedContent = pack.content ? (pack.content as any)[lang] || post.content : post.content
  const localizedCategory = (pack.category as any)[lang] || post.category
  const localizedReadTime = (pack.readTime as any)[lang] || post.readTime

  let localizedAuthor = post.author
  if (post.author) {
    localizedAuthor = {
      ...post.author,
      name: pack.authorName ? (pack.authorName as any)[lang] || post.author.name : post.author.name,
      title: pack.authorTitle ? (pack.authorTitle as any)[lang] || post.author.title : post.author.title,
    }
  }

  return {
    ...post,
    title: localizedTitle,
    summary: localizedSummary,
    content: localizedContent,
    category: localizedCategory,
    readTime: localizedReadTime,
    author: localizedAuthor,
  }
}

/* ═══════════════════════════════════════════════════════════════
   CANDIDATE PORTFOLIO LOCALIZATION
   ═══════════════════════════════════════════════════════════════ */

export function getLocalizedPortfolio<T extends {
  fullName?: string
  title?: string
  bio?: string
  headline?: string
  location?: string | null
  [key: string]: any
}>(portfolio: T, lang: Language): T {
  if (!portfolio) return portfolio

  if (lang === "en") {
    return {
      ...portfolio,
      fullName: "Ahmed Al-Farsi",
      title: "Lead Frontend & Design Systems Engineer",
      bio: "Software engineer specialized in architecting scalable digital platforms and design systems. Dedicated to web performance, accessibility, and high-impact digital experiences.",
      location: "Riyadh, Saudi Arabia",
    }
  }

  if (lang === "hi") {
    return {
      ...portfolio,
      fullName: "अहमद अल-फारसी",
      title: "प्रमुख फ्रंटएंड और डिज़ाइन सिस्टम इंजीनियर",
      bio: "स्केलेबल डिजिटल प्लेटफॉर्म और डिज़ाइन सिस्टम के निर्माण में विशेषज्ञता प्राप्त सॉफ्टवेयर इंजीनियर। उच्च प्रदर्शन, वेब एक्सेसिबिलिटी और असाधारण यूजर अनुभव के प्रति समर्पित।",
      location: "रियाद, सऊदी अरब",
    }
  }

  return portfolio
}

/* ═══════════════════════════════════════════════════════════════
   COMPANIES LOCALIZATION
   ═══════════════════════════════════════════════════════════════ */

export function getLocalizedCompany<T extends {
  name: string
  description?: string
  companyField?: string | null
  location?: string
  [key: string]: any
}>(company: T, lang: Language): T {
  if (!company) return company
  const localizedName = getLocalizedCompanyName(company, lang)
  const localizedLocation = getLocalizedCity(company.location, lang)

  let localizedField = company.companyField
  if (company.companyField) {
    if (lang === "en") {
      if (company.companyField.includes("طاقة") || company.companyField.includes("معلومات")) localizedField = "Digital Energy & Cloud Intelligence"
      else if (company.companyField.includes("ذكاء")) localizedField = "Artificial Intelligence & Data Science"
      else if (company.companyField.includes("اتصالات")) localizedField = "Telecommunications & Digital Services"
      else if (company.companyField.includes("مدن")) localizedField = "Future Cities & Sustainable Tech"
      else if (company.companyField.includes("تجارة") || company.companyField.includes("توصيل")) localizedField = "E-Commerce & Quick Logistics"
      else if (company.companyField.includes("أمن") || company.companyField.includes("سيبراني")) localizedField = "Cybersecurity & Digital Trust"
    } else if (lang === "hi") {
      if (company.companyField.includes("طاقة") || company.companyField.includes("معلومات")) localizedField = "डिजिटल ऊर्जा और क्लाउड समाधान"
      else if (company.companyField.includes("ذكاء")) localizedField = "आर्टिफिशियल इंटेलिजेंस और डेटा साइंस"
      else if (company.companyField.includes("اتصالات")) localizedField = "दूरसंचार और डिजिटल सेवाएं"
      else if (company.companyField.includes("مدن")) localizedField = "स्मार्ट शहर और सतत तकनीक"
      else if (company.companyField.includes("تجارة") || company.companyField.includes("توصيل")) localizedField = "ई-कॉमर्स और त्वरित लॉजिस्टिक्स"
      else if (company.companyField.includes("أمن") || company.companyField.includes("سيبراني")) localizedField = "साइबर सुरक्षा और डिजिटल समाधान"
    }
  }

  return {
    ...company,
    name: localizedName,
    location: localizedLocation,
    companyField: localizedField,
  }
}

/* ═══════════════════════════════════════════════════════════════
   TEAMS LOCALIZATION
   ═══════════════════════════════════════════════════════════════ */

export function getLocalizedTeam<T extends {
  name: string
  about?: string
  achievements?: string
  location?: string
  [key: string]: any
}>(team: T, lang: Language): T {
  if (!team) return team

  let localizedName = team.name
  let localizedAbout = team.about
  let localizedLocation = getLocalizedCity(team.location, lang)

  if (lang === "en") {
    if (team.name.includes("الابتكار") || team.name.includes("Cloud")) {
      localizedName = "Cloud & AI Alpha Squad"
      localizedAbout = "High-performing cross-functional team specialized in training, deploying LLMs, and cloud-native DevSecOps architectures."
    } else if (team.name.includes("تصميم") || team.name.includes("UX")) {
      localizedName = "Nexus UX & Product Design Studio"
      localizedAbout = "Full-service digital product design studio crafting scalable design systems and intuitive FinTech experiences."
    } else if (team.name.includes("المالية") || team.name.includes("FinTech")) {
      localizedName = "FinTech & Smart Payments Squad"
      localizedAbout = "Specialized engineering unit building open-banking connectors, compliant payment gateways, and fraud mitigation engines."
    }
  } else if (lang === "hi") {
    if (team.name.includes("الابتكار") || team.name.includes("Cloud")) {
      localizedName = "क्लाउड और एआई अल्फा स्क्वाड"
      localizedAbout = "एलएलएम मॉडल के प्रशिक्षण, तैनाती और क्लाउड-नेटिव आर्किटेक्चर में विशेषज्ञता प्राप्त उच्च प्रदर्शन वाली टीम।"
    } else if (team.name.includes("تصميم") || team.name.includes("UX")) {
      localizedName = "नेक्सस यूएक्स और प्रोडक्ट डिज़ाइन स्टूडियो"
      localizedAbout = "स्केलेबल डिज़ाइन सिस्टम और सहज डिजिटल उत्पाद अनुभव तैयार करने वाला डिज़ाइन स्टूडियो।"
    } else if (team.name.includes("المالية") || team.name.includes("FinTech")) {
      localizedName = "फिनटेक और स्मार्ट भुगतान दस्ता"
      localizedAbout = "ओपन-बैंकिंग, सुरक्षित भुगतान गेटवे और वित्तीय अनुपालन में विशेषज्ञता वाली इंजीनियरिंग टीम।"
    }
  }

  return {
    ...team,
    name: localizedName,
    about: localizedAbout,
    location: localizedLocation,
  }
}


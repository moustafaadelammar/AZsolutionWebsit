import {
  BadgeCheck, Cable, Camera, Cctv, Flame, HardDrive, Headphones, KeyRound,
  Network, PhoneCall, Router, Server, ShieldCheck, Wrench, Zap, type LucideIcon,
} from "lucide-react";

export type Language = "ar" | "en";
export type LocalText = { ar: string; en: string };

export const SITE_CONFIG = {
  brand: "AZ Solution",
  identifier: "BNS",
  serviceArea: { ar: "بني سويف وصعيد مصر", en: "Beni Suef & Upper Egypt" },
  phone: "[رقم الهاتف / Phone number]",
  email: "[البريد الإلكتروني / Email address]",
  address: "[العنوان / Office address]",
  whatsappUrl: "#contact-placeholder",
  social: ["LinkedIn", "Facebook"],
} as const;

export const navItems = [
  { to: "/", label: { ar: "الرئيسية", en: "Home" } },
  { to: "/services", label: { ar: "الخدمات", en: "Services" } },
  { to: "/solutions", label: { ar: "الحلول والمنتجات", en: "Solutions" } },
  { to: "/projects", label: { ar: "المشروعات", en: "Projects" } },
  { to: "/about", label: { ar: "من نحن", en: "About" } },
  { to: "/contact", label: { ar: "تواصل معنا", en: "Contact" } },
] as const;

export type ContentItem = {
  title: LocalText;
  description: LocalText;
  icon: LucideIcon;
  tag?: LocalText;
};

export const services: ContentItem[] = [
  { title: { ar: "البنية التحتية لتقنية المعلومات", en: "IT Infrastructure" }, description: { ar: "تصميم وتجهيز بيئة تقنية منظمة وقابلة للتوسع تناسب احتياجات العمل.", en: "Structured, scalable technology environments tailored to business operations." }, icon: Server },
  { title: { ar: "الشبكات والاتصال", en: "Networks & Connectivity" }, description: { ar: "حلول الشبكات السلكية واللاسلكية وإعداد الراوترات والسويتشات.", en: "Wired and wireless networks, router and switch configuration." }, icon: Network },
  { title: { ar: "الأمن والمراقبة", en: "Security & Surveillance" }, description: { ar: "أنظمة كاميرات المراقبة والتحكم في الدخول وحماية نقاط الاتصال.", en: "CCTV, access control, and protected network endpoints." }, icon: Cctv },
  { title: { ar: "الخوادم والتخزين", en: "Servers & Storage" }, description: { ar: "توريد وتهيئة الخوادم ووحدات التخزين وفق حجم وطبيعة المؤسسة.", en: "Server and storage supply and setup aligned with your organization." }, icon: HardDrive },
  { title: { ar: "الدعم والصيانة الميدانية", en: "Field Support & Maintenance" }, description: { ar: "فحص الأعطال والصيانة الدورية والدعم الفني في موقع العمل.", en: "Troubleshooting, scheduled maintenance, and on-site technical support." }, icon: Wrench },
  { title: { ar: "الاتصالات واستمرارية التشغيل", en: "Telephony & Business Continuity" }, description: { ar: "حلول VoIP وUPS والملحقات الأساسية لاستمرارية التشغيل.", en: "VoIP, UPS, and essential accessories for operational continuity." }, icon: PhoneCall },
];

export const solutions: ContentItem[] = [
  { title: { ar: "الخوادم والتخزين", en: "Servers & Storage" }, description: { ar: "خوادم، وحدات تخزين، وملحقات مراكز البيانات.", en: "Servers, storage units, and data center accessories." }, icon: Server },
  { title: { ar: "الشبكات", en: "Networking" }, description: { ar: "راوترات، سويتشات، نقاط وصول، وتجهيزات الربط.", en: "Routers, switches, access points, and connectivity hardware." }, icon: Router },
  { title: { ar: "الجدران النارية", en: "Firewalls" }, description: { ar: "حلول حماية وإدارة حركة الشبكات للشركات.", en: "Business network protection and traffic management solutions." }, icon: ShieldCheck },
  { title: { ar: "كاميرات المراقبة", en: "CCTV" }, description: { ar: "كاميرات ومسجلات وحلول مراقبة للمواقع المختلفة.", en: "Cameras, recorders, and surveillance solutions for varied sites." }, icon: Camera },
  { title: { ar: "التحكم في الدخول", en: "Access Control" }, description: { ar: "أنظمة تنظيم الدخول والحضور لتأمين المنشآت.", en: "Entry and attendance systems for controlled facilities." }, icon: KeyRound },
  { title: { ar: "الاتصالات الهاتفية", en: "VoIP" }, description: { ar: "سنترالات IP وهواتف شبكية وربط الفروع.", en: "IP PBX, network phones, and branch connectivity." }, icon: Headphones },
  { title: { ar: "وحدات الطاقة الاحتياطية", en: "UPS" }, description: { ar: "حماية واستمرارية الطاقة للأجهزة والبنية التقنية.", en: "Power protection and continuity for critical equipment." }, icon: Zap },
  { title: { ar: "الكابلات والملحقات", en: "Cables & Accessories" }, description: { ar: "كابلات شبكات وملحقات وتجهيزات تقنية أساسية.", en: "Network cabling, accessories, and essential IT supplies." }, icon: Cable },
];

export const additionalServices: ContentItem[] = [
  { title: { ar: "السلامة الأساسية", en: "Basic Safety Supplies" }, description: { ar: "توريد طفايات حريق ومستلزمات سلامة أساسية وفق متطلبات الموقع.", en: "Fire extinguishers and basic safety supplies aligned with site needs." }, icon: Flame },
  { title: { ar: "التوريد المؤسسي", en: "Corporate Supply" }, description: { ar: "تجميع متطلبات الأجهزة والملحقات في عرض منظم وواضح.", en: "Consolidated hardware and accessory requirements in a clear proposal." }, icon: BadgeCheck },
];

export const processSteps: { number: string; title: LocalText; description: LocalText }[] = [
  { number: "01", title: { ar: "نفهم الموقع", en: "Understand" }, description: { ar: "نراجع الاحتياج والموقع والأجهزة الحالية والهدف التشغيلي.", en: "We review the need, site, current setup, and operating goal." } },
  { number: "02", title: { ar: "نحدد الحل", en: "Specify" }, description: { ar: "نحوّل المتطلبات إلى نطاق واضح ومواصفات قابلة للتنفيذ.", en: "We turn requirements into a clear, executable scope and specification." } },
  { number: "03", title: { ar: "نورّد وننفذ", en: "Deliver" }, description: { ar: "توريد منظم وتنفيذ ميداني واختبارات قبل التسليم.", en: "Structured supply, field deployment, and checks before handover." } },
  { number: "04", title: { ar: "ندعم التشغيل", en: "Support" }, description: { ar: "متابعة وصيانة ودعم فني يساعد البيئة التقنية على الاستمرار.", en: "Follow-up, maintenance, and technical support for continuity." } },
];

export const sampleProjects = [
  { title: { ar: "تجهيز شبكة لمكتب متعدد الأقسام", en: "Multi-department Office Network" }, type: { ar: "نموذج توضيحي — شبكات", en: "Sample — Networking" }, description: { ar: "تصور لمشروع يشمل الكابلات المنظمة والسويتشات ونقاط الوصول واختبارات التسليم.", en: "A sample scope covering structured cabling, switches, access points, and handover testing." }, icon: Network },
  { title: { ar: "نظام مراقبة وتحكم في الدخول", en: "CCTV & Access Control System" }, type: { ar: "نموذج توضيحي — أمن", en: "Sample — Security" }, description: { ar: "مثال تخطيطي لتغطية المداخل والمناطق المهمة مع تسجيل مركزي وصلاحيات دخول.", en: "A conceptual deployment for entrances and critical areas with central recording and access permissions." }, icon: Cctv },
  { title: { ar: "تحديث غرفة خوادم صغيرة", en: "Small Server Room Upgrade" }, type: { ar: "نموذج توضيحي — بنية تحتية", en: "Sample — Infrastructure" }, description: { ar: "سيناريو تجريبي لتنظيم الراك والطاقة الاحتياطية والتخزين وربط الشبكة.", en: "A demo scenario for rack organization, backup power, storage, and network integration." }, icon: Server },
];

export const languageNames = { ar: "العربية", en: "English" } as const;

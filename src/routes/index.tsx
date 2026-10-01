import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { ContentGrid, QuoteBand, SectionHeading } from "@/components/site-sections";
import { sampleProjects, services, solutions } from "@/lib/site-data";
const heroImage = "/az-hero.svg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "AZ Solution BNS | IT Solutions in Beni Suef & Upper Egypt" },
    { name: "description", content: "IT infrastructure, networking, servers, CCTV, access control, VoIP, UPS, supplies and field support across Beni Suef and Upper Egypt." },
    { property: "og:title", content: "AZ Solution BNS | Business Technology Solutions" },
    { property: "og:description", content: "Reliable IT infrastructure, security, connectivity and technical support for organizations in Beni Suef and Upper Egypt." },
    { property: "og:type", content: "website" }, { property: "og:url", content: "/" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/" }] }),
  component: HomePage,
});

function HomePage() {
  const { language, t } = useLanguage();
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;
  return <>
    <section className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden bg-ink text-ink-foreground">
      <img src={heroImage} alt={language === "ar" ? "مهندس شبكات يفحص تجهيزات خادم" : "Network engineer inspecting server equipment"} width={1536} height={1024} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--ink)_0%,color-mix(in_oklab,var(--ink)_92%,transparent)_42%,color-mix(in_oklab,var(--ink)_15%,transparent)_100%)] rtl:bg-[linear-gradient(270deg,var(--ink)_0%,color-mix(in_oklab,var(--ink)_92%,transparent)_42%,color-mix(in_oklab,var(--ink)_15%,transparent)_100%)]" />
      <div className="tech-grid absolute inset-0 opacity-20" />
      <div className="container-shell relative flex min-h-[calc(100svh-4.5rem)] items-center py-16">
        <div className="reveal-up max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 border-s-2 border-tech-bright ps-3 text-xs font-bold text-tech-bright"><MapPin className="size-4" />{language === "ar" ? "بني سويف وصعيد مصر" : "Beni Suef & Upper Egypt"}</div>
          <h1 className="text-4xl font-extrabold leading-[1.3] md:text-6xl lg:text-7xl">{language === "ar" ? <>تقنية أعمالك،<br /><span className="text-tech-bright">مصمّمة لتستمر.</span></> : <>Business technology,<br /><span className="text-tech-bright">built to keep going.</span></>}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">{language === "ar" ? "نصمم ونورّد وندعم حلول البنية التحتية والشبكات والأمن التقني للمؤسسات، من التخطيط إلى التشغيل الميداني." : "We design, supply, and support IT infrastructure, networking, and security solutions—from planning through on-site operation."}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link to="/quote">{language === "ar" ? "اطلب عرض سعر" : "Request a Quote"}<Arrow /></Link></Button><Button asChild variant="light" size="lg"><Link to="/services">{language === "ar" ? "استكشف خدماتنا" : "Explore Services"}</Link></Button></div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink-line pt-6 text-xs text-ink-muted"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-tech-bright" />{language === "ar" ? "حلول حسب الاحتياج" : "Needs-led solutions"}</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-tech-bright" />{language === "ar" ? "دعم فني ميداني" : "On-site support"}</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-tech-bright" />{language === "ar" ? "توريد مؤسسي منظم" : "Structured corporate supply"}</span></div>
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28"><div className="container-shell"><SectionHeading eyebrow={{ ar: "قدراتنا", en: "Capabilities" }} title={{ ar: "حلول تقنية تغطي دورة العمل كاملة", en: "Technology solutions across the full operating cycle" }} description={{ ar: "من البنية الأساسية إلى الصيانة اليومية، نربط المكونات في حل واضح وسهل الإدارة.", en: "From core infrastructure to everyday maintenance, we connect every component into a clear, manageable solution." }} /><ContentGrid items={services} /><div className="mt-8"><Button asChild variant="outline"><Link to="/services">{language === "ar" ? "عرض جميع الخدمات" : "View all services"}<Arrow /></Link></Button></div></div></section>

    <section className="bg-secondary py-20 md:py-28"><div className="container-shell"><SectionHeading eyebrow={{ ar: "المنتجات والحلول", en: "Products & Solutions" }} title={{ ar: "فئات مختارة لبيئة عمل متكاملة", en: "Focused categories for an integrated workplace" }} description={{ ar: "نساعدك في تحديد الفئة والمواصفات المناسبة بدلاً من بيع منتجات منفصلة بلا سياق.", en: "We help define the right category and specification rather than selling disconnected products." }} /><ContentGrid items={solutions.slice(0, 6)} compact /></div></section>

    <section className="py-20 md:py-28"><div className="container-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><div><SectionHeading eyebrow={{ ar: "لماذا AZ Solution", en: "Why AZ Solution" }} title={{ ar: "شريك تقني يفهم احتياج الموقع", en: "A technology partner that understands the site" }} description={{ ar: "نبدأ من متطلبات التشغيل الفعلية، ثم نبني نطاقاً واضحاً يجمع التوريد والتنفيذ والدعم.", en: "We begin with real operating needs, then define a clear scope combining supply, deployment, and support." }} /><Button asChild className="mt-7" variant="outline"><Link to="/about">{language === "ar" ? "تعرّف علينا" : "About us"}<Arrow /></Link></Button></div><div className="grid gap-4 sm:grid-cols-2">{[{ ar: "حل واحد متكامل", en: "One integrated scope" }, { ar: "وضوح في المواصفات", en: "Clear specifications" }, { ar: "تنفيذ منظم", en: "Structured delivery" }, { ar: "استجابة ميدانية", en: "Field-ready support" }].map((item, index) => <div key={item.en} className="border-s-2 border-tech bg-card p-6 shadow-sm"><span className="font-display text-3xl font-bold text-tech">0{index + 1}</span><h3 className="mt-4 text-lg font-bold">{t(item)}</h3></div>)}</div></div></section>

    <section className="bg-ink py-20 text-ink-foreground md:py-28"><div className="container-shell"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={{ ar: "نماذج مشروعات", en: "Project Samples" }} title={{ ar: "تصورات عملية لنطاقات التنفيذ", en: "Practical examples of project scopes" }} description={{ ar: "المحتوى التالي أمثلة توضيحية فقط، وليس ادعاءً بمشروعات منفذة.", en: "The following is demo content only, not a claim of completed work." }} /><Button asChild variant="light"><Link to="/projects">{language === "ar" ? "كل النماذج" : "All samples"}<Arrow /></Link></Button></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{sampleProjects.map(({ title, type, description, icon: Icon }) => <article key={title.en} className="border border-ink-line bg-ink-panel p-7"><Icon className="size-7 text-tech-bright"/><p className="mt-8 text-xs font-bold text-tech-bright">{t(type)}</p><h3 className="mt-3 text-xl font-bold">{t(title)}</h3><p className="mt-4 text-sm leading-7 text-ink-muted">{t(description)}</p></article>)}</div></div></section>

    <section className="py-20"><div className="container-shell text-center"><SectionHeading align="center" eyebrow={{ ar: "العلامات التجارية", en: "Brands" }} title={{ ar: "نختار العلامة وفق مواصفات المشروع", en: "Brands selected to match the project specification" }} description={{ ar: "لا توجد شراكات أو اعتمادات معلنة حالياً. تُضاف العلامات المؤكدة هنا لاحقاً.", en: "No partnerships or authorizations are currently stated. Confirmed brands can be added here later." }} /><div className="mt-10 grid gap-3 sm:grid-cols-3"><div className="border border-dashed border-border p-5 text-sm text-muted-foreground">[Brand placeholder 01]</div><div className="border border-dashed border-border p-5 text-sm text-muted-foreground">[Brand placeholder 02]</div><div className="border border-dashed border-border p-5 text-sm text-muted-foreground">[Brand placeholder 03]</div></div></div></section>
    <QuoteBand />
  </>;
}
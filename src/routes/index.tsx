import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { ContentGrid, ProcessGrid, QuoteBand, SectionHeading } from "@/components/site-sections";
import { processSteps, sampleProjects, services, solutions } from "@/lib/site-data";

const heroImage = "/az-hero.svg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "AZ Solution BNS | IT Solutions in Beni Suef & Upper Egypt" },
    { name: "description", content: "IT infrastructure, networking, servers, CCTV, access control, VoIP, UPS, supplies and field support across Beni Suef and Upper Egypt." },
    { property: "og:title", content: "AZ Solution BNS | Business Technology Solutions" },
    { property: "og:description", content: "Reliable IT infrastructure, security, connectivity and technical support for organizations in Beni Suef and Upper Egypt." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "/" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/" }] }),
  component: HomePage,
});

function HomePage() {
  const { language, t } = useLanguage();
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  return <>
    <section className="hero-section relative isolate min-h-[calc(100svh-4.75rem)] overflow-hidden bg-ink text-ink-foreground">
      <img src={heroImage} alt={language === "ar" ? "حلول تقنية وبنية تحتية" : "Technology infrastructure solutions"} width={1536} height={1024} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--ink)_0%,color-mix(in_oklab,var(--ink)_90%,transparent)_44%,color-mix(in_oklab,var(--ink)_18%,transparent)_100%)] rtl:bg-[linear-gradient(270deg,var(--ink)_0%,color-mix(in_oklab,var(--ink)_90%,transparent)_44%,color-mix(in_oklab,var(--ink)_18%,transparent)_100%)]" />
      <div className="tech-grid absolute inset-0 opacity-20" />
      <div className="container-shell relative flex min-h-[calc(100svh-4.75rem)] items-center py-16">
        <div className="reveal-up max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-tech-bright"><Sparkles className="size-4" />AZ Solution · BNS</div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-tech-bright/30 bg-ink-panel/60 px-3 py-2 text-xs font-bold text-tech-bright"><MapPin className="size-4" />{language === "ar" ? "بني سويف وصعيد مصر" : "Beni Suef & Upper Egypt"}</div>
          <h1 className="text-4xl font-extrabold leading-[1.22] md:text-6xl lg:text-7xl">{language === "ar" ? <>تقنية أعمالك،<br /><span className="text-tech-bright">مصمّمة لتستمر.</span></> : <>Business technology,<br /><span className="text-tech-bright">built to keep going.</span></>}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">{language === "ar" ? "نصمم ونورّد وننفذ وندعم حلول البنية التحتية والشبكات والأمن التقني للمؤسسات، من التخطيط إلى التشغيل الميداني." : "We design, supply, deploy, and support IT infrastructure, networking, and security solutions—from planning through field operation."}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link to="/quote">{language === "ar" ? "اطلب عرض سعر" : "Request a Quote"}<Arrow /></Link></Button><Button asChild variant="light" size="lg"><Link to="/services">{language === "ar" ? "استكشف الخدمات" : "Explore services"}</Link></Button></div>
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">{[{ icon: CheckCircle2, ar: "حلول حسب الاحتياج", en: "Needs-led" }, { icon: ShieldCheck, ar: "بنية تقنية منظمة", en: "Structured IT" }, { icon: CheckCircle2, ar: "دعم ميداني", en: "Field support" }].map(({ icon: Icon, ar, en }) => <div key={en} className="hero-chip"><Icon className="size-4 text-tech-bright" />{language === "ar" ? ar : en}</div>)}</div>
        </div>
      </div>
    </section>

    <section className="border-b border-border bg-background"><div className="container-shell grid gap-px bg-border sm:grid-cols-3"><div className="stat-card"><strong>360°</strong><span>{language === "ar" ? "من التخطيط إلى التشغيل" : "From planning to operation"}</span></div><div className="stat-card"><strong>01</strong><span>{language === "ar" ? "نطاق عمل واضح" : "Clear project scope"}</span></div><div className="stat-card"><strong>BNS</strong><span>{language === "ar" ? "بني سويف وصعيد مصر" : "Beni Suef & Upper Egypt"}</span></div></div></section>

    <section className="py-20 md:py-28"><div className="container-shell"><SectionHeading eyebrow={{ ar: "قدراتنا", en: "Capabilities" }} title={{ ar: "كل ما يحتاجه موقعك التقني في نطاق واضح", en: "What your site needs, organized into one clear scope" }} description={{ ar: "من الشبكات والخوادم إلى المراقبة والدعم، نربط المكونات في حل قابل للفهم والإدارة.", en: "From networks and servers to surveillance and support, we connect the pieces into a manageable solution." }} /><ContentGrid items={services} /><div className="mt-8 flex justify-end"><Button asChild variant="outline"><Link to="/services">{language === "ar" ? "عرض كل الخدمات" : "View all services"}<Arrow /></Link></Button></div></div></section>

    <section className="bg-secondary py-20 md:py-28"><div className="container-shell"><SectionHeading eyebrow={{ ar: "كيف نشتغل", en: "How we work" }} title={{ ar: "من الاحتياج إلى حل قابل للتشغيل", en: "From requirement to an operating solution" }} description={{ ar: "خطوات بسيطة وواضحة تقلل الغموض قبل التوريد والتنفيذ.", en: "Simple, clear steps that reduce ambiguity before supply and deployment." }} /><ProcessGrid items={processSteps} /></div></section>

    <section className="py-20 md:py-28"><div className="container-shell"><SectionHeading eyebrow={{ ar: "الحلول", en: "Solutions" }} title={{ ar: "فئات تقنية نختار منها حسب احتياجك", en: "Technology categories selected around your needs" }} /><ContentGrid items={solutions.slice(0, 6)} compact /><div className="mt-8 flex justify-center"><Button asChild variant="outline"><Link to="/solutions">{language === "ar" ? "استكشف كل الفئات" : "Explore all categories"}<Arrow /></Link></Button></div></div></section>

    <section className="bg-ink py-20 text-ink-foreground md:py-28"><div className="container-shell"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><SectionHeading eyebrow={{ ar: "نماذج مشروعات", en: "Project Samples" }} title={{ ar: "تصورات عملية لنطاقات التنفيذ", en: "Practical examples of project scopes" }} description={{ ar: "المحتوى التالي أمثلة توضيحية فقط، وليس ادعاءً بمشروعات منفذة.", en: "The following is demo content only, not a claim of completed work." }} /><Button asChild variant="light"><Link to="/projects">{language === "ar" ? "كل النماذج" : "All samples"}<Arrow /></Link></Button></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{sampleProjects.map(({ title, type, description, icon: Icon }, index) => <article key={title.en} className="project-card"><Icon className="size-7 text-tech-bright" /><span className="mt-8 block text-xs font-bold text-tech-bright">0{index + 1} · {t(type)}</span><h3 className="mt-3 text-xl font-bold">{t(title)}</h3><p className="mt-4 text-sm leading-7 text-ink-muted">{t(description)}</p></article>)}</div></div></section>

    <section className="py-20"><div className="container-shell text-center"><SectionHeading align="center" eyebrow={{ ar: "جاهزون للبدء؟", en: "Ready to start?" }} title={{ ar: "أرسل احتياجك وسنرتب الخطوة التالية", en: "Send your requirement and we’ll structure the next step" }} description={{ ar: "لا تحتاج لمعرفة كل المواصفات. اشرح الوضع الحالي والهدف، وسنساعدك في تحويله إلى نطاق واضح.", en: "You don't need every specification. Tell us the current situation and goal, and we'll help shape a clear scope." }} /><Button asChild className="mt-8" size="lg"><Link to="/quote">{language === "ar" ? "ابدأ طلب عرض السعر" : "Start a quote request"}<Arrow /></Link></Button></div></section>
    <QuoteBand />
  </>;
}

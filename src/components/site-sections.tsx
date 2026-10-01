import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ChevronRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import type { ContentItem, LocalText } from "@/lib/site-data";

export function SectionHeading({ eyebrow, title, description, align = "start" }: { eyebrow: LocalText; title: LocalText; description?: LocalText; align?: "start" | "center" }) {
  const { t } = useLanguage();
  return <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}><p className="eyebrow">{t(eyebrow)}</p><h2 className="section-title mt-3">{t(title)}</h2>{description && <p className="section-copy mt-4">{t(description)}</p>}</div>;
}

export function ContentGrid({ items, compact = false }: { items: ContentItem[]; compact?: boolean }) {
  const { t, language } = useLanguage();
  return <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(({ title, description, icon: Icon }, index) => <article key={title.en} className={"content-card group flex h-full flex-col " + (compact ? "p-6" : "p-7 md:p-8")}><div className="flex items-start justify-between gap-4"><span className="grid size-12 place-items-center rounded-xl bg-tech-soft text-tech transition-transform duration-300 group-hover:-translate-y-1"><Icon className="size-5" /></span><span className="text-xs font-bold text-muted-foreground/60">0{index + 1}</span></div><h3 className="mt-6 text-lg font-bold text-card-foreground">{t(title)}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{t(description)}</p><Link to="/quote" className="mt-auto pt-6 inline-flex items-center gap-1 text-xs font-bold text-tech transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{language === "ar" ? "اطلب هذه الخدمة" : "Request this service"}<ChevronRight className="size-3 rtl:rotate-180" /></Link></article>)}</div>;
}

export function PageIntro({ eyebrow, title, description, icon: Icon }: { eyebrow: LocalText; title: LocalText; description: LocalText; icon?: LucideIcon }) {
  const { t } = useLanguage();
  return <section className="page-intro"><div className="tech-grid absolute inset-0 opacity-30" /><div className="container-shell relative grid gap-8 py-16 md:grid-cols-[1fr_auto] md:items-end md:py-24"><div className="max-w-3xl"><p className="eyebrow text-tech-bright">{t(eyebrow)}</p><h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-ink-foreground md:text-6xl">{t(title)}</h1><p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">{t(description)}</p></div>{Icon && <div className="hidden size-28 place-items-center rounded-2xl border border-ink-line bg-ink-panel text-tech-bright shadow-lg md:grid"><Icon className="size-11" /></div>}</div></section>;
}

export function ProcessGrid({ items }: { items: { number: string; title: LocalText; description: LocalText }[] }) {
  const { t } = useLanguage();
  return <div className="mt-10 grid gap-4 md:grid-cols-4">{items.map((item) => <div key={item.number} className="process-card"><span>{item.number}</span><h3>{t(item.title)}</h3><p>{t(item.description)}</p></div>)}</div>;
}

export function QuoteBand() {
  const { language } = useLanguage();
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;
  return <section className="quote-band relative overflow-hidden"><div className="absolute inset-0 tech-grid opacity-10" /><div className="container-shell relative flex flex-col gap-6 py-12 text-primary-foreground md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-bold text-primary-foreground/70">AZ Solution · BNS</p><h2 className="mt-2 text-2xl font-bold md:text-3xl">{language === "ar" ? "جاهز نحدد الحل المناسب؟" : "Ready to define the right solution?"}</h2><p className="mt-2 max-w-xl text-sm leading-7 text-primary-foreground/75">{language === "ar" ? "أرسل احتياجك وسنحوّله إلى نطاق واضح يمكن مراجعته وتنفيذه." : "Send your requirements and turn them into a clear, reviewable scope."}</p></div><Button asChild variant="light" size="lg"><Link to="/quote">{language === "ar" ? "ابدأ طلبك" : "Start your request"}<Arrow /></Link></Button></div></section>;
}

export function CheckList({ items }: { items: LocalText[] }) {
  const { t } = useLanguage();
  return <ul className="grid gap-4">{items.map((item) => <li key={item.en} className="flex items-start gap-3 text-sm leading-7 text-foreground"><span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-tech-soft text-tech"><Check className="size-3" /></span>{t(item)}</li>)}</ul>;
}

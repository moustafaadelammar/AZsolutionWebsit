import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Languages, MapPin, Menu, MessageCircle, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/components/language-provider";
import { navItems, SITE_CONFIG } from "@/lib/site-data";

function Brand() {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="AZ Solution home">
      <span className="grid size-10 place-items-center rounded-md bg-primary font-display text-lg font-bold text-primary-foreground transition-transform group-hover:-translate-y-0.5">AZ</span>
      <span className="leading-none">
        <span className="block font-display text-base font-bold text-foreground">AZ Solution</span>
        <span className="mt-1 block text-[10px] font-bold tracking-[0.22em] text-tech">BNS</span>
      </span>
    </Link>
  );
}

function RequestCount() { const [count,setCount]=useState(0); useEffect(()=>{const load=()=>setCount((JSON.parse(localStorage.getItem("az-quote-items")||"[]") as string[]).length); load(); window.addEventListener("az-quote-updated",load); return ()=>window.removeEventListener("az-quote-updated",load);},[]); if(!count) return null; return <span className="absolute -end-2 -top-2 grid min-w-5 h-5 place-items-center rounded-full bg-tech px-1 text-[10px] font-bold text-white">{count}</span>; }

function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  const next = language === "ar" ? "en" : "ar";
  return (
    <Button variant="ghost" size="sm" onClick={() => setLanguage(next)} aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}>
      <Languages aria-hidden="true" />
      {language === "ar" ? "EN" : "عربي"}
    </Button>
  );
}

export function SiteHeader() {
  const { language, t } = useLanguage();
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="container-shell flex h-18 items-center justify-between gap-4">
        <Brand />
        <nav className="hidden items-center gap-1 lg:flex" aria-label={language === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className="nav-link" activeProps={{ className: "nav-link-active" }}>
              {t(item.label)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitch />
          <div className="relative"><Button asChild size="lg"><Link to="/quote">{language === "ar" ? "اطلب عرض سعر" : "Request a Quote"}<ArrowUpRight /></Link></Button><RequestCount /></div>
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitch />
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" size="icon" aria-label={language === "ar" ? "فتح القائمة" : "Open menu"}><Menu /></Button></SheetTrigger>
            <SheetContent side={language === "ar" ? "left" : "right"} className="w-[88%] pt-16">
              <SheetTitle className="sr-only">{language === "ar" ? "القائمة" : "Menu"}</SheetTitle>
              <SheetDescription className="sr-only">{language === "ar" ? "روابط الموقع" : "Site navigation"}</SheetDescription>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => <SheetClose key={item.to} asChild><Link to={item.to} className="rounded-md px-4 py-3 text-lg font-semibold text-foreground hover:bg-accent">{t(item.label)}</Link></SheetClose>)}
                <SheetClose asChild><Button asChild size="lg" className="mt-4"><Link to="/quote">{language === "ar" ? "اطلب عرض سعر" : "Request a Quote"}</Link></Button></SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { language, t } = useLanguage();
  return (
    <div className="container-shell pb-4"><Link to="/business" className="text-xs font-semibold text-muted-foreground hover:text-foreground">{language === "ar" ? "مركز تشغيل الشركة" : "Business Operations Center"}</Link></div>\n<footer className="bg-ink text-ink-foreground">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-md">
          <div className="font-display text-2xl font-bold">AZ Solution <span className="text-tech">BNS</span></div>
          <p className="mt-4 text-sm leading-7 text-ink-muted">{language === "ar" ? "حلول تقنية وتوريدات مؤسسية مصممة لدعم أعمالك بثبات ووضوح." : "Technology solutions and corporate supplies designed to keep your business operating with clarity and confidence."}</p>
          <div className="mt-5 flex items-center gap-2 text-sm text-ink-muted"><MapPin className="size-4 text-tech" />{t(SITE_CONFIG.serviceArea)}</div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-ink-foreground">{language === "ar" ? "روابط سريعة" : "Quick links"}</h2>
          <div className="mt-4 grid gap-3 text-sm text-ink-muted">
            {navItems.slice(1, 5).map((item) => <Link key={item.to} to={item.to} className="hover:text-ink-foreground">{t(item.label)}</Link>)}
          </div>
        </div>
        <div id="contact-placeholder">
          <h2 className="text-sm font-bold uppercase tracking-widest text-ink-foreground">{language === "ar" ? "بيانات التواصل" : "Contact details"}</h2>
          <div className="mt-4 grid gap-3 text-sm text-ink-muted">
            <span>{SITE_CONFIG.phone}</span><span>{SITE_CONFIG.email}</span><span>{SITE_CONFIG.address}</span><span className="flex items-center gap-2"><Clock3 className="size-4 text-tech" />{t(SITE_CONFIG.businessHours)}</span>
            <span className="text-xs text-tech">{language === "ar" ? "بيانات مؤقتة — تُستبدل قبل النشر" : "Placeholders — replace before publishing"}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-line"><div className="container-shell flex flex-col gap-3 py-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between"><span>© AZ Solution BNS</span><span>{SITE_CONFIG.social.join(" · ")} — {language === "ar" ? "روابط مؤقتة" : "placeholders"}</span></div></div>
    </footer>
  );
}

export function WhatsAppPlaceholder() {
  const { language } = useLanguage();
  return <a href={SITE_CONFIG.whatsappUrl} className="fixed bottom-5 end-5 z-30 grid size-13 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-elevated transition-transform hover:-translate-y-1" aria-label={language === "ar" ? "واتساب — أضف الرقم أولاً" : "WhatsApp — add number first"} title={language === "ar" ? "رابط مؤقت" : "Placeholder link"}><MessageCircle className="size-6" /></a>;
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /><WhatsAppPlaceholder /></>;
}
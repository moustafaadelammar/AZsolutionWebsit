import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, Languages, MapPin, Menu, MessageCircle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/components/language-provider";
import { navItems, SITE_CONFIG } from "@/lib/site-data";

function Brand() {
  return (
    <Link to="/" className="brand-lockup group" aria-label="AZ Solution BNS home">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-mark-a">A</span><span className="brand-mark-z">Z</span>
      </span>
      <span className="brand-copy">
        <span className="brand-name">AZ Solution</span>
        <span className="brand-sub">BNS · TECHNOLOGY & SUPPLY</span>
      </span>
    </Link>
  );
}

function RequestCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const load = () => {
      try { setCount((JSON.parse(localStorage.getItem("az-quote-items") || "[]") as string[]).length); }
      catch { setCount(0); }
    };
    load();
    window.addEventListener("az-quote-updated", load);
    return () => window.removeEventListener("az-quote-updated", load);
  }, []);
  if (!count) return null;
  return <span className="request-count">{count}</span>;
}

function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  const next = language === "ar" ? "en" : "ar";
  return (
    <Button variant="ghost" size="sm" className="language-switch" onClick={() => setLanguage(next)}
      aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}>
      <Languages aria-hidden="true" />{language === "ar" ? "EN" : "عربي"}
    </Button>
  );
}

export function SiteHeader() {
  const { language, t } = useLanguage();
  return (
    <header className="site-header">
      <div className="container-shell header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label={language === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }}
              className="nav-link" activeProps={{ className: "nav-link nav-link-active" }}>
              {t(item.label)}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <div className="header-contact"><PhoneCall className="size-4" /><span>{language === "ar" ? "حلول تقنية للأعمال" : "Business technology"}</span></div>
          <LanguageSwitch />
          <div className="quote-action">
            <Button asChild size="lg"><Link to="/quote">{language === "ar" ? "اطلب عرض سعر" : "Request a Quote"}<ArrowUpRight /></Link></Button>
            <RequestCount />
          </div>
        </div>
        <div className="mobile-actions">
          <LanguageSwitch />
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" size="icon" aria-label={language === "ar" ? "فتح القائمة" : "Open menu"}><Menu /></Button></SheetTrigger>
            <SheetContent side={language === "ar" ? "left" : "right"} className="mobile-menu">
              <SheetTitle className="sr-only">{language === "ar" ? "القائمة" : "Menu"}</SheetTitle>
              <SheetDescription className="sr-only">{language === "ar" ? "روابط الموقع" : "Site navigation"}</SheetDescription>
              <div className="mobile-brand"><Brand /></div>
              <nav className="mobile-nav">
                {navItems.map((item) => <SheetClose key={item.to} asChild><Link to={item.to} className="mobile-nav-link">{t(item.label)}</Link></SheetClose>)}
                <SheetClose asChild><Button asChild size="lg" className="mt-3"><Link to="/quote">{language === "ar" ? "اطلب عرض سعر" : "Request a Quote"}<ArrowUpRight /></Link></Button></SheetClose>
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
    <footer className="site-footer">
      <div className="container-shell footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>{language === "ar" ? "حلول تقنية وتوريدات مؤسسية مصممة لدعم أعمالك بثبات ووضوح." : "Technology solutions and corporate supplies designed to keep your business operating with clarity and confidence."}</p>
          <div className="footer-location"><MapPin />{t(SITE_CONFIG.serviceArea)}</div>
        </div>
        <div>
          <h2>{language === "ar" ? "روابط سريعة" : "Quick links"}</h2>
          <div className="footer-links">
            {navItems.slice(1, 7).map((item) => <Link key={item.to} to={item.to}>{t(item.label)}</Link>)}
          </div>
        </div>
        <div id="contact-placeholder">
          <h2>{language === "ar" ? "بيانات التواصل" : "Contact details"}</h2>
          <div className="footer-contact">
            <span>{SITE_CONFIG.phone}</span><span>{SITE_CONFIG.email}</span><span>{SITE_CONFIG.address}</span>
            <span className="footer-hours"><Clock3 />{t(SITE_CONFIG.businessHours)}</span>
          </div>
          <p className="footer-note">{language === "ar" ? "أضف بيانات التواصل الحقيقية قبل الإطلاق." : "Add the real contact details before launch."}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container-shell footer-bottom-inner">
          <span>© {new Date().getFullYear()} AZ Solution BNS</span>
          <span>{language === "ar" ? "حلول تقنية وتوريدات · بني سويف وصعيد مصر" : "Technology & supply · Beni Suef & Upper Egypt"}</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppPlaceholder() {
  const { language } = useLanguage();
  const enabled = SITE_CONFIG.whatsappUrl.startsWith("https://wa.me/");
  return (
    <a href={SITE_CONFIG.whatsappUrl} aria-disabled={!enabled}
      className={`whatsapp-float ${enabled ? "" : "whatsapp-disabled"}`}
      aria-label={enabled ? "WhatsApp" : language === "ar" ? "واتساب — أضف الرقم أولاً" : "WhatsApp — add number first"}
      title={enabled ? "WhatsApp" : language === "ar" ? "أضف رقم واتساب في الإعدادات" : "Add WhatsApp number in settings"}>
      <MessageCircle />
    </a>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /><WhatsAppPlaceholder /></>;
}

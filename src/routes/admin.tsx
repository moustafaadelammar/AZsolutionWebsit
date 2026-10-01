import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Copy, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { PageIntro } from "@/components/site-sections";

type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
type Lead = { id:string; createdAt:string; name:string; phone:string; email:string; service:string; details:string; selectedItems:string[]; status?:LeadStatus };

export const Route = createFileRoute("/admin")({ head: () => ({ meta: [
  { title: "Lead Inbox Preview | AZ Solution BNS" },
  { name: "robots", content: "noindex,nofollow" },
]}), component: AdminPage });

function AdminPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");\n  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const load = () => setLeads(JSON.parse(localStorage.getItem("az-leads") || "[]") as Lead[]);
  useEffect(() => { load(); }, []);
  const clear = () => { localStorage.removeItem("az-leads"); localStorage.removeItem("az-last-lead"); load(); };
  const updateStatus = (id:string, status:LeadStatus) => { const next=leads.map(lead => lead.id===id ? {...lead,status} : lead); setLeads(next); localStorage.setItem("az-leads", JSON.stringify(next)); };
  const visible = leads.filter(lead => { const hay=[lead.id,lead.name,lead.phone,lead.email,lead.service,lead.details].join(" ").toLowerCase(); return hay.includes(query.toLowerCase()) && (statusFilter==="all" || (lead.status||"new")===statusFilter); });\n  const statusLabel = (status:LeadStatus) => ({new:ar?"جديد":"New",contacted:ar?"تم التواصل":"Contacted",quoted:ar?"تم التسعير":"Quoted",won:ar?"تمت الصفقة":"Won",lost:ar?"مغلق":"Lost"}[status]);
  const copy = async (lead: Lead) => {
    const text = [
      `AZ Solution — ${lead.id}`, `Name: ${lead.name}`, `Phone: ${lead.phone}`,
      `Email: ${lead.email || "-"}`, `Service: ${lead.service}`,
      `Selected: ${lead.selectedItems?.join(", ") || "-"}`, `Details: ${lead.details}`,
    ].join("\\n");
    await navigator.clipboard?.writeText(text);
  };
  return <><PageIntro icon={ClipboardList} eyebrow={{ar:"إدارة الطلبات — وضع المعاينة",en:"Lead Management — Preview Mode"}} title={{ar:"صندوق طلبات عروض الأسعار",en:"Quote Request Inbox"}} description={{ar:"هذه الصفحة تعمل محلياً داخل المتصفح فقط. لن تظهر الطلبات هنا على جهاز آخر حتى يتم ربط قاعدة بيانات وواجهة دخول.",en:"This page is local to this browser only. Leads will not appear on another device until a database and authentication are connected."}} />
    <section className="bg-secondary py-12 md:py-16"><div className="container-shell">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold">{ar ? `عدد الطلبات: ${leads.length}` : `Leads: ${leads.length}`}</p><p className="mt-1 text-xs text-muted-foreground">{ar ? "وضع محلي مؤقت" : "Temporary local mode"}</p></div>{leads.length > 0 && <Button variant="outline" onClick={clear}><Trash2 />{ar ? "مسح كل الطلبات" : "Clear all leads"}</Button>}</div>
      {leads.length > 0 && <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={ar?"بحث بالاسم أو الهاتف أو الخدمة...":"Search name, phone or service..."} className="h-11 rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" /><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as "all"|LeadStatus)} className="h-11 rounded-md border border-input bg-card px-3 text-sm"><option value="all">{ar?"كل الحالات":"All statuses"}</option>{(["new","contacted","quoted","won","lost"] as LeadStatus[]).map(s=><option key={s} value={s}>{statusLabel(s)}</option>)}</select></div>}\n      {leads.length === 0 ? <div className="border border-dashed border-border bg-card p-10 text-center text-muted-foreground">{ar ? "لا توجد طلبات محفوظة على هذا المتصفح حتى الآن." : "No leads are saved in this browser yet."}</div> :
      <div className="grid gap-4">{visible.map(lead => <article key={lead.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-tech-soft px-2.5 py-1 text-xs font-bold text-tech">{lead.id}</span><span className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleString(ar ? "ar-EG" : "en-US")}</span><span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold">{statusLabel(lead.status||"new")}</span></div>
        <h2 className="mt-3 text-xl font-bold">{lead.name}</h2><p className="mt-1 text-sm" dir="ltr">{lead.phone}</p>{lead.email && <p className="mt-1 text-sm text-muted-foreground" dir="ltr">{lead.email}</p>}</div>
        <Button variant="outline" onClick={() => copy(lead)}><Copy />{ar ? "نسخ" : "Copy"}</Button></div>
        <div className="mt-5 flex flex-wrap gap-2">{(["new","contacted","quoted","won","lost"] as LeadStatus[]).map(s=><button key={s} type="button" onClick={()=>updateStatus(lead.id,s)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${(lead.status||"new")===s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"}`}>{statusLabel(s)}</button>)}</div><div className="mt-5 grid gap-4 md:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "الخدمة" : "Service"}</p><p className="mt-1 font-semibold">{lead.service}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "العناصر" : "Selected items"}</p><p className="mt-1 text-sm">{lead.selectedItems?.join(" · ") || "—"}</p></div></div>
        <div className="mt-5 rounded-lg bg-secondary p-4 text-sm leading-7">{lead.details}</div>
      </article>)}</div>}
    </div></section></>;
}
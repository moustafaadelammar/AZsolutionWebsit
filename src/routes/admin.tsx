import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Copy, Download, Search, Trash2, Users, CheckCircle2, Clock3, FileText, Package, Upload, DatabaseBackup, CalendarClock, Phone, Mail, Megaphone, Link2, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { PageIntro } from "@/components/site-sections";
import { Link } from "@tanstack/react-router";

type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
type LeadPriority = "low" | "normal" | "high" | "urgent";
type LeadSource = "website-quote" | "whatsapp" | "phone" | "referral" | "other";
type Campaign = { id: string; name: string; channel: "facebook" | "instagram" | "google" | "whatsapp"; objective: "leads" | "traffic" | "awareness" | "retargeting"; budget: number; startDate: string; endDate: string; offer: string; cta: string; status: "draft" | "ready" | "active" | "paused"; createdAt: string; };
type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  details: string;
  selectedItems: string[];
  status?: LeadStatus;
  priority?: LeadPriority;
  source?: LeadSource;
  campaign?: string;
  notes?: string;
  updatedAt?: string;
  attachment?: { name: string; size: number; type: string };
  quotationAmount?: number;
  quotationCurrency?: "EGP" | "USD";
  nextFollowUpAt?: string;
};

const statuses: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Lead Inbox Preview | AZ Solution BNS" },
    { name: "robots", content: "noindex,nofollow" },
  ] }),
  component: AdminPage,
});

function AdminPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignName, setCampaignName] = useState("");
  const [campaignChannel, setCampaignChannel] = useState<Campaign["channel"]>("facebook");
  const [campaignObjective, setCampaignObjective] = useState<Campaign["objective"]>("leads");
  const [campaignBudget, setCampaignBudget] = useState("1000");
  const [campaignOffer, setCampaignOffer] = useState("25% off first 50 customers");
  const [campaignCta, setCampaignCta] = useState("Request a Quote");

  const load = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("az-leads") || "[]") as Lead[];
      setLeads(saved.map((lead) => ({ ...lead, status: lead.status || "new", priority: lead.priority || "normal", source: lead.source || "website-quote" })));
    } catch {
      setLeads([]);
    }
  };

  useEffect(() => { load(); try { setCampaigns(JSON.parse(localStorage.getItem("az-campaigns") || "[]") as Campaign[]); } catch { setCampaigns([]); } }, []);

  const persist = (next: Lead[]) => {
    setLeads(next);
    localStorage.setItem("az-leads", JSON.stringify(next));
  };

  const updateLead = (id: string, patch: Partial<Lead>) => {
    persist(leads.map((lead) => lead.id === id ? { ...lead, ...patch, updatedAt: new Date().toISOString() } : lead));
  };

  const priorityLabel = (priority: LeadPriority) => ({ low: ar ? "منخفضة" : "Low", normal: ar ? "عادية" : "Normal", high: ar ? "عالية" : "High", urgent: ar ? "عاجلة" : "Urgent" }[priority]);
  const sourceLabel = (source: LeadSource) => ({ "website-quote": ar ? "الموقع" : "Website", whatsapp: "WhatsApp", phone: ar ? "هاتف" : "Phone", referral: ar ? "ترشيح" : "Referral", other: ar ? "أخرى" : "Other" }[source]);
  const saveCampaign = () => {
    const campaign: Campaign = { id: `CMP-${Date.now().toString(36).toUpperCase()}`, name: campaignName.trim() || (ar ? "حملة جديدة" : "New campaign"), channel: campaignChannel, objective: campaignObjective, budget: Math.max(0, Number(campaignBudget) || 0), startDate: new Date().toISOString().slice(0,10), endDate: "", offer: campaignOffer.trim(), cta: campaignCta.trim() || "Request a Quote", status: "draft", createdAt: new Date().toISOString() };
    const next = [campaign, ...campaigns]; setCampaigns(next); localStorage.setItem("az-campaigns", JSON.stringify(next)); setCampaignName("");
  };
  const campaignUtm = (campaign: Campaign) => `${typeof window !== "undefined" ? window.location.origin : ""}/quote?utm_source=${campaign.channel}&utm_medium=paid&utm_campaign=${encodeURIComponent(campaign.name.toLowerCase().replace(/\s+/g,"-"))}`;
  const copyCampaign = async (campaign: Campaign) => { const text = [`Campaign: ${campaign.name}`, `Channel: ${campaign.channel}`, `Objective: ${campaign.objective}`, `Budget: ${campaign.budget} EGP`, `Offer: ${campaign.offer}`, `CTA: ${campaign.cta}`, `UTM: ${campaignUtm(campaign)}`].join("\\n"); await navigator.clipboard?.writeText(text); };
  const updateCampaign = (id: string, patch: Partial<Campaign>) => { const next = campaigns.map((x) => x.id === id ? { ...x, ...patch } : x); setCampaigns(next); localStorage.setItem("az-campaigns", JSON.stringify(next)); };

  const backupData = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      leads,
      inventory: JSON.parse(localStorage.getItem("az-inventory") || "[]"),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `az-solution-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const restoreData = async (file: File) => {
    try {
      const payload = JSON.parse(await file.text()) as { leads?: Lead[]; inventory?: unknown[] };
      if (!Array.isArray(payload.leads)) throw new Error("Invalid backup");
      localStorage.setItem("az-leads", JSON.stringify(payload.leads));
      if (Array.isArray(payload.inventory)) localStorage.setItem("az-inventory", JSON.stringify(payload.inventory));
      load();
      window.alert(ar ? "تم استرجاع النسخة الاحتياطية." : "Backup restored successfully.");
    } catch {
      window.alert(ar ? "ملف النسخة الاحتياطية غير صالح." : "Invalid backup file.");
    }
  };

  const clear = () => {
    if (!window.confirm(ar ? "هل تريد مسح كل الطلبات المحلية؟" : "Clear all local leads?")) return;
    localStorage.removeItem("az-leads");
    localStorage.removeItem("az-last-lead");
    setLeads([]);
  };

  const statusLabel = (status: LeadStatus) => ({
    new: ar ? "جديد" : "New",
    contacted: ar ? "تم التواصل" : "Contacted",
    quoted: ar ? "تم التسعير" : "Quoted",
    won: ar ? "تمت الصفقة" : "Won",
    lost: ar ? "مغلق" : "Lost",
  }[status]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const hay = [lead.id, lead.name, lead.phone, lead.email, lead.service, lead.details, lead.notes, lead.campaign, sourceLabel(lead.source || "website-quote"), priorityLabel(lead.priority || "normal")].join(" ").toLowerCase();
      return hay.includes(q) && (statusFilter === "all" || (lead.status || "new") === statusFilter);
    });
  }, [leads, query, statusFilter]);

  const counts = useMemo(() => statuses.reduce<Record<LeadStatus, number>>((acc, status) => {
    acc[status] = leads.filter((lead) => (lead.status || "new") === status).length;
    return acc;
  }, { new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 }), [leads]);

  const copy = async (lead: Lead) => {
    const summary = [
      `AZ Solution — ${lead.id}`,
      `Name: ${lead.name}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email || "-"}`,
      `Service: ${lead.service}`,
      `Selected: ${lead.selectedItems?.join(", ") || "-"}`,
      `Details: ${lead.details || "-"}`,
      `Notes: ${lead.notes || "-"}`,
    ].join("\n");
    await navigator.clipboard?.writeText(summary);
  };

  const exportCsv = () => {
    const headers = ["ID", "Created At", "Name", "Phone", "Email", "Service", "Selected Items", "Status", "Priority", "Source", "Campaign", "Details", "Notes", "Quotation Amount", "Currency", "Next Follow-up", "Attachment"];
    const esc = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = leads.map((lead) => [
      lead.id, lead.createdAt, lead.name, lead.phone, lead.email, lead.service,
      lead.selectedItems?.join(" | "), statusLabel(lead.status || "new"), priorityLabel(lead.priority || "normal"), sourceLabel(lead.source || "website-quote"), lead.campaign || "", lead.details, lead.notes,
      lead.quotationAmount ?? "", lead.quotationCurrency || "", lead.nextFollowUpAt || "", lead.attachment ? `${lead.attachment.name} (${lead.attachment.size} bytes)` : "",
    ].map(esc).join(","));
    const csv = "\uFEFF" + [headers.map(esc).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `az-solution-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currencyTotals = leads.reduce<Record<"EGP" | "USD", number>>((acc, lead) => {
    const amount = Number(lead.quotationAmount) || 0;
    if (amount > 0) acc[lead.quotationCurrency || "EGP"] += amount;
    return acc;
  }, { EGP: 0, USD: 0 });

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayFollowUps = leads.filter((lead) => lead.nextFollowUpAt?.slice(0, 10) === todayKey && lead.status !== "won" && lead.status !== "lost").length;

  const overdueFollowUps = leads.filter((lead) => {
    if (!lead.nextFollowUpAt || lead.status === "won" || lead.status === "lost") return false;
    return new Date(lead.nextFollowUpAt).getTime() < Date.now();
  }).length;

  const followUpLabel = (lead: Lead) => {
    if (!lead.nextFollowUpAt) return null;
    const overdue = new Date(lead.nextFollowUpAt).getTime() < Date.now() && lead.status !== "won" && lead.status !== "lost";
    return { overdue, text: new Date(lead.nextFollowUpAt).toLocaleString(ar ? "ar-EG" : "en-US") };
  };

  const sourceCounts = useMemo(() => (["website-quote","whatsapp","phone","referral","other"] as LeadSource[]).map((source) => ({ source, count: leads.filter((lead) => (lead.source || "website-quote") === source).length })), [leads]);
  const campaignCounts = useMemo(() => { const map = new Map<string, number>(); leads.forEach((lead) => { if (lead.campaign) map.set(lead.campaign, (map.get(lead.campaign) || 0) + 1); }); return [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8); }, [leads]);
  const adCopy = (campaign: Campaign) => ar
    ? `🚀 ${campaign.offer || "حلول تقنية متكاملة"}\n\nAZ Solution BNS تساعد الشركات في بني سويف وصعيد مصر في الشبكات، السيرفرات، كاميرات المراقبة، الحماية والدعم الفني.\n\n🎯 ${campaign.cta}\n📍 بني سويف وصعيد مصر\n\n#AZSolution #BeniSuef #IT #Networking #CCTV`
    : `🚀 ${campaign.offer || "Complete business technology solutions"}\n\nAZ Solution BNS helps businesses across Beni Suef & Upper Egypt with networking, servers, CCTV, security and IT support.\n\n🎯 ${campaign.cta}\n📍 Beni Suef & Upper Egypt\n\n#AZSolution #BeniSuef #IT #Networking #CCTV`;

  const statCards = [
    { label: ar ? "كل الطلبات" : "Total", value: leads.length, icon: Users },
    { label: ar ? "جديد" : "New", value: counts.new, icon: Clock3 },
    { label: ar ? "تم التسعير" : "Quoted", value: counts.quoted, icon: FileText },
    { label: ar ? "تمت الصفقة" : "Won", value: counts.won, icon: CheckCircle2 },
    { label: ar ? "عروض EGP" : "EGP quoted", value: currencyTotals.EGP.toLocaleString(ar ? "ar-EG" : "en-US"), icon: FileText },
    { label: ar ? "عروض USD" : "USD quoted", value: currencyTotals.USD.toLocaleString(ar ? "ar-EG" : "en-US"), icon: FileText },
    { label: ar ? "متابعات اليوم" : "Today follow-ups", value: todayFollowUps, icon: CalendarClock },
    { label: ar ? "متابعات متأخرة" : "Overdue follow-ups", value: overdueFollowUps, icon: CalendarClock },
  ];

  return <>
    <PageIntro
      icon={ClipboardList}
      eyebrow={{ ar: "إدارة الطلبات — وضع المعاينة", en: "Lead Management — Preview Mode" }}
      title={{ ar: "صندوق طلبات عروض الأسعار", en: "Quote Request Inbox" }}
      description={{ ar: "لوحة CRM محلية مؤقتة لمتابعة العملاء والطلبات. البيانات محفوظة داخل هذا المتصفح فقط.", en: "A temporary local CRM board for tracking customers and quote requests. Data is stored in this browser only." }}
    />

    <section className="bg-secondary py-10 md:py-14">
      <div className="container-shell mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link to="/inventory"><Package />{ar ? "إدارة المخزون والمنتجات" : "Inventory & Products"}</Link></Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {ar ? "ملخص المبيعات:" : "Sales summary:"} EGP {currencyTotals.EGP.toLocaleString(ar ? "ar-EG" : "en-US")} · USD {currencyTotals.USD.toLocaleString(ar ? "ar-EG" : "en-US")}
        </div>
      </div>
      <div className="container-shell">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className="h-5 w-5 text-tech" />
              </div>
              <p className="mt-3 text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold">{ar ? "مسار المبيعات" : "Sales pipeline"}</p>
              <p className="text-xs text-muted-foreground">{ar ? "توزيع الطلبات حسب المرحلة الحالية" : "Lead distribution by current stage"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {statuses.map((status) => (
              <button key={status} type="button" onClick={() => setStatusFilter(status)}
                className="rounded-xl border border-border bg-background p-3 text-start transition-colors hover:bg-accent">
                <p className="text-xs font-semibold text-muted-foreground">{statusLabel(status)}</p>
                <p className="mt-1 text-2xl font-black">{counts[status]}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={ar ? "ابحث بالاسم، الهاتف، الخدمة، أو الملاحظات..." : "Search name, phone, service, or notes..."}
                className="h-11 w-full rounded-md border border-input bg-background px-10 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | LeadStatus)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm">
              <option value="all">{ar ? "كل الحالات" : "All statuses"}</option>
              {statuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
            </select>
            <div className="flex gap-2">
              {leads.length > 0 && <Button variant="outline" onClick={exportCsv}><Download />{ar ? "تصدير CSV" : "Export CSV"}</Button>}
              {leads.length > 0 && <Button variant="outline" onClick={clear}><Trash2 />{ar ? "مسح الكل" : "Clear all"}</Button>}              <Button variant="outline" onClick={backupData}><DatabaseBackup />{ar ? "نسخة احتياطية" : "Backup"}</Button>              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent">                <Upload className="h-4 w-4" />{ar ? "استرجاع" : "Restore"}                <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void restoreData(file); e.currentTarget.value = ""; }} />              </label>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {ar ? `عرض ${visible.length} من ${leads.length} طلب • البيانات محلية وغير متاحة من جهاز آخر.` : `Showing ${visible.length} of ${leads.length} leads • Local data is not available from another device.`}
          </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div><div className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-tech" /><p className="font-bold">{ar ? "مركز الدعاية والنمو" : "Marketing & Growth Center"}</p></div><p className="mt-1 text-sm text-muted-foreground">{ar ? "خطط الحملات، جهّز عروض الإعلانات، وأنشئ روابط UTM لتعرف أي حملة جلبت العميل." : "Plan campaigns, prepare ad offers, and create UTM links so you can track which campaign generated each lead."}</p></div>
            <span className="rounded-full bg-tech-soft px-3 py-1 text-xs font-bold text-tech">{ar ? "تشغيل محلي — جاهز للربط لاحقاً مع Meta/Google" : "Local workflow — ready for Meta/Google integration later"}</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <input value={campaignName} onChange={(e)=>setCampaignName(e.target.value)} placeholder={ar ? "اسم الحملة" : "Campaign name"} className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
            <select value={campaignChannel} onChange={(e)=>setCampaignChannel(e.target.value as Campaign["channel"])} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="google">Google</option><option value="whatsapp">WhatsApp</option></select>
            <select value={campaignObjective} onChange={(e)=>setCampaignObjective(e.target.value as Campaign["objective"])} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="leads">{ar ? "عملاء محتملون" : "Leads"}</option><option value="traffic">{ar ? "زيارات" : "Traffic"}</option><option value="awareness">{ar ? "وعي" : "Awareness"}</option><option value="retargeting">{ar ? "إعادة استهداف" : "Retargeting"}</option></select>
            <input type="number" min="0" value={campaignBudget} onChange={(e)=>setCampaignBudget(e.target.value)} placeholder="Budget EGP" className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
            <input value={campaignOffer} onChange={(e)=>setCampaignOffer(e.target.value)} placeholder={ar ? "العرض" : "Offer"} className="h-10 rounded-md border border-input bg-background px-3 text-sm md:col-span-2" />
            <input value={campaignCta} onChange={(e)=>setCampaignCta(e.target.value)} placeholder="CTA" className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
            <Button onClick={saveCampaign}><Save />{ar ? "حفظ الحملة" : "Save campaign"}</Button>
          </div>
          {campaigns.length > 0 && <div className="mt-5 grid gap-3">{campaigns.slice(0,6).map((campaign)=><div key={campaign.id} className="rounded-xl border border-border bg-background p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{campaign.name}</p><p className="text-xs text-muted-foreground">{campaign.channel} · {campaign.objective} · {campaign.budget.toLocaleString()} EGP</p></div><div className="flex items-center gap-2"><select value={campaign.status} onChange={(e)=>updateCampaign(campaign.id,{status:e.target.value as Campaign["status"]})} className="h-9 rounded-md border border-input bg-background px-2 text-xs"><option value="draft">Draft</option><option value="ready">Ready</option><option value="active">Active</option><option value="paused">Paused</option></select><Button variant="outline" size="sm" onClick={()=>copyCampaign(campaign)}><Copy className="h-4 w-4" />{ar ? "نسخ" : "Copy"}</Button></div></div><div className="mt-3 grid gap-2 md:grid-cols-2"><div className="rounded-lg bg-secondary p-3 text-sm"><b>{ar ? "العرض:" : "Offer:"}</b> {campaign.offer}<br/><b>CTA:</b> {campaign.cta}</div><div className="rounded-lg bg-secondary p-3 text-xs break-all"><div className="mb-1 flex items-center gap-1 font-bold"><Link2 className="h-3.5 w-3.5" />UTM</div>{campaignUtm(campaign)}</div></div></div>)}</div>}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2"><Users className="h-5 w-5 text-tech" /><p className="font-bold">{ar ? "مصادر العملاء" : "Lead Sources"}</p></div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">{sourceCounts.map(({source,count})=><button key={source} type="button" onClick={()=>setQuery(sourceLabel(source).toLowerCase())} className="flex items-center justify-between rounded-xl border border-border p-3 text-start hover:bg-accent"><span className="text-sm font-semibold">{sourceLabel(source)}</span><span className="text-xl font-black">{count}</span></button>)}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-tech" /><p className="font-bold">{ar ? "الحملات التي جلبت عملاء" : "Campaign Attribution"}</p></div>
            {campaignCounts.length ? <div className="mt-4 space-y-2">{campaignCounts.map(([name,count])=><div key={name} className="flex items-center justify-between rounded-xl bg-secondary p-3"><span className="truncate text-sm font-semibold">{name}</span><span className="rounded-full bg-tech-soft px-2.5 py-1 text-xs font-bold text-tech">{count} {ar ? "عميل" : "leads"}</span></div>)}</div> : <p className="mt-4 text-sm text-muted-foreground">{ar ? "ستظهر بيانات الحملات هنا بعد وصول طلبات من روابط UTM." : "Campaigns will appear here after leads arrive through UTM links."}</p>}
          </div>
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-tech" /><p className="font-bold">{ar ? "استوديو محتوى الإعلانات" : "Ad Copy Studio"}</p></div>
          <p className="mt-1 text-sm text-muted-foreground">{ar ? "نسخة جاهزة للنشر لكل حملة — عدّلها حسب العرض والمنصة." : "Ready-to-edit ad copy for each campaign. Adjust it for the platform and offer."}</p>
          {campaigns.length ? <div className="mt-4 grid gap-3">{campaigns.slice(0,4).map((campaign)=><div key={campaign.id} className="rounded-xl border border-border bg-background p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-bold">{campaign.name}</p><p className="text-xs text-muted-foreground">{campaign.channel} · {campaign.objective}</p></div><Button variant="outline" size="sm" onClick={()=>navigator.clipboard?.writeText(adCopy(campaign))}><Copy className="h-4 w-4" />{ar ? "نسخ النص" : "Copy copy"}</Button></div><pre className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap rounded-lg bg-secondary p-3 text-xs leading-6 font-sans">{adCopy(campaign)}</pre></div>)}</div> : <p className="mt-4 text-sm text-muted-foreground">{ar ? "أنشئ أول حملة من مركز الدعاية بالأعلى." : "Create your first campaign in the Marketing Center above."}</p>}
        </div>

        <div className="mt-6 grid gap-4">
          {visible.length === 0 ? (
            <div className="border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
              {leads.length === 0 ? (ar ? "لا توجد طلبات محفوظة على هذا المتصفح حتى الآن." : "No leads are saved in this browser yet.") : (ar ? "لا توجد نتائج مطابقة للبحث الحالي." : "No leads match the current filters.")}
            </div>
          ) : visible.map((lead) => (
            <article key={lead.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-tech-soft px-2.5 py-1 text-xs font-bold text-tech">{lead.id}</span>
                    <span className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleString(ar ? "ar-EG" : "en-US")}</span>
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold">{statusLabel(lead.status || "new")}</span><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">{priorityLabel(lead.priority || "normal")}</span><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{sourceLabel(lead.source || "website-quote")}</span>{lead.campaign && <span className="rounded-full bg-tech-soft px-2.5 py-1 text-xs font-semibold text-tech">{lead.campaign}</span>}
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{lead.name}</h2>
                  <p className="mt-1 text-sm" dir="ltr">{lead.phone}</p>
                  {lead.email && <p className="mt-1 text-sm text-muted-foreground" dir="ltr">{lead.email}</p>}
                </div>
                <div className="flex flex-wrap gap-2"><a href={`tel:${lead.phone}`} className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent"><Phone className="h-4 w-4" />{ar ? "اتصال" : "Call"}</a>{lead.email && <a href={`mailto:${lead.email}`} className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent"><Mail className="h-4 w-4" />Email</a>}<Button variant="outline" onClick={() => copy(lead)}><Copy />{ar ? "نسخ الطلب" : "Copy request"}</Button></div>
              </div>

              {followUpLabel(lead) && (
                <div className={`mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${followUpLabel(lead)?.overdue ? "border-destructive/40 bg-destructive/5 text-destructive" : "border-border bg-secondary"}`}>
                  <CalendarClock className="h-4 w-4" />
                  <span className="font-semibold">{followUpLabel(lead)?.overdue ? (ar ? "متابعة متأخرة:" : "Overdue follow-up:") : (ar ? "المتابعة:" : "Follow-up:")}</span>
                  <span>{followUpLabel(lead)?.text}</span>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button key={status} type="button" onClick={() => updateLead(lead.id, { status })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${(lead.status || "new") === status ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"}`}>
                    {statusLabel(status)}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "الأولوية" : "Priority"}</p><select value={lead.priority || "normal"} onChange={(e) => updateLead(lead.id, { priority: e.target.value as LeadPriority })} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{(["low","normal","high","urgent"] as LeadPriority[]).map((x) => <option key={x} value={x}>{priorityLabel(x)}</option>)}</select></div>
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "المصدر" : "Source"}</p><select value={lead.source || "website-quote"} onChange={(e) => updateLead(lead.id, { source: e.target.value as LeadSource })} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{(["website-quote","whatsapp","phone","referral","other"] as LeadSource[]).map((x) => <option key={x} value={x}>{sourceLabel(x)}</option>)}</select></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "قيمة العرض" : "Quotation value"}</p>
                  <div className="mt-2 flex gap-2">
                    <input type="number" min="0" value={lead.quotationAmount ?? ""} onChange={(e) => updateLead(lead.id, { quotationAmount: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value)) })} placeholder="0" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" />
                    <select value={lead.quotationCurrency || "EGP"} onChange={(e) => updateLead(lead.id, { quotationCurrency: e.target.value as "EGP" | "USD" })} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option value="EGP">EGP</option><option value="USD">USD</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "المتابعة القادمة" : "Next follow-up"}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-tech" />
                    <input type="datetime-local" value={lead.nextFollowUpAt || ""} onChange={(e) => updateLead(lead.id, { nextFollowUpAt: e.target.value || undefined })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "الخدمة" : "Service"}</p><p className="mt-1 font-semibold">{lead.service}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "العناصر" : "Selected items"}</p><p className="mt-1 text-sm">{lead.selectedItems?.join(" · ") || "—"}</p></div>
              </div>

              <div className="mt-5 rounded-lg bg-secondary p-4 text-sm leading-7">{lead.details || (ar ? "بدون تفاصيل إضافية." : "No additional details.")}</div>
              {lead.attachment && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold">{ar ? "ملف مرفق" : "Attachment"}</p>
                    <p className="truncate text-xs text-muted-foreground">{lead.attachment.name}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {(lead.attachment.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}

              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "ملاحظات المتابعة" : "Follow-up notes"}</label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <textarea defaultValue={lead.notes || ""} onBlur={(e) => {
                    if (e.target.value !== (lead.notes || "")) updateLead(lead.id, { notes: e.target.value });
                  }} placeholder={ar ? "مثال: تم الاتصال — العميل ينتظر عرض السعر..." : "Example: Called customer — waiting for quotation..."}
                    className="min-h-20 flex-1 rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </>;
}

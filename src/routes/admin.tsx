import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Copy, Download, Search, Trash2, Users, CheckCircle2, Clock3, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { PageIntro } from "@/components/site-sections";

type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
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
  notes?: string;
  updatedAt?: string;
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

  const load = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("az-leads") || "[]") as Lead[];
      setLeads(saved.map((lead) => ({ ...lead, status: lead.status || "new" })));
    } catch {
      setLeads([]);
    }
  };

  useEffect(() => { load(); }, []);

  const persist = (next: Lead[]) => {
    setLeads(next);
    localStorage.setItem("az-leads", JSON.stringify(next));
  };

  const updateLead = (id: string, patch: Partial<Lead>) => {
    persist(leads.map((lead) => lead.id === id ? { ...lead, ...patch, updatedAt: new Date().toISOString() } : lead));
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
      const hay = [lead.id, lead.name, lead.phone, lead.email, lead.service, lead.details, lead.notes].join(" ").toLowerCase();
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
    const headers = ["ID", "Created At", "Name", "Phone", "Email", "Service", "Selected Items", "Status", "Details", "Notes"];
    const esc = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = leads.map((lead) => [
      lead.id, lead.createdAt, lead.name, lead.phone, lead.email, lead.service,
      lead.selectedItems?.join(" | "), statusLabel(lead.status || "new"), lead.details, lead.notes,
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

  const statCards = [
    { label: ar ? "كل الطلبات" : "Total", value: leads.length, icon: Users },
    { label: ar ? "جديد" : "New", value: counts.new, icon: Clock3 },
    { label: ar ? "تم التسعير" : "Quoted", value: counts.quoted, icon: FileText },
    { label: ar ? "تمت الصفقة" : "Won", value: counts.won, icon: CheckCircle2 },
  ];

  return <>
    <PageIntro
      icon={ClipboardList}
      eyebrow={{ ar: "إدارة الطلبات — وضع المعاينة", en: "Lead Management — Preview Mode" }}
      title={{ ar: "صندوق طلبات عروض الأسعار", en: "Quote Request Inbox" }}
      description={{ ar: "لوحة CRM محلية مؤقتة لمتابعة العملاء والطلبات. البيانات محفوظة داخل هذا المتصفح فقط.", en: "A temporary local CRM board for tracking customers and quote requests. Data is stored in this browser only." }}
    />

    <section className="bg-secondary py-10 md:py-14">
      <div className="container-shell">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              {leads.length > 0 && <Button variant="outline" onClick={clear}><Trash2 />{ar ? "مسح الكل" : "Clear all"}</Button>}
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {ar ? `عرض ${visible.length} من ${leads.length} طلب • البيانات محلية وغير متاحة من جهاز آخر.` : `Showing ${visible.length} of ${leads.length} leads • Local data is not available from another device.`}
          </p>
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
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold">{statusLabel(lead.status || "new")}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{lead.name}</h2>
                  <p className="mt-1 text-sm" dir="ltr">{lead.phone}</p>
                  {lead.email && <p className="mt-1 text-sm text-muted-foreground" dir="ltr">{lead.email}</p>}
                </div>
                <Button variant="outline" onClick={() => copy(lead)}><Copy />{ar ? "نسخ الطلب" : "Copy request"}</Button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button key={status} type="button" onClick={() => updateLead(lead.id, { status })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${(lead.status || "new") === status ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"}`}>
                    {statusLabel(status)}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "الخدمة" : "Service"}</p><p className="mt-1 font-semibold">{lead.service}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{ar ? "العناصر" : "Selected items"}</p><p className="mt-1 text-sm">{lead.selectedItems?.join(" · ") || "—"}</p></div>
              </div>

              <div className="mt-5 rounded-lg bg-secondary p-4 text-sm leading-7">{lead.details || (ar ? "بدون تفاصيل إضافية." : "No additional details.")}</div>

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

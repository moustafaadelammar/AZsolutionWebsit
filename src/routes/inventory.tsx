import { createFileRoute } from "@tanstack/react-router";
import { Download, Package, Plus, Minus, Search, RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { PageIntro } from "@/components/site-sections";
import { catalog, inventorySeed, type InventoryRecord, type StockState } from "@/lib/catalog";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory Preview | AZ Solution BNS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: InventoryPage,
});

const KEY = "az-inventory";

function InventoryPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [items, setItems] = useState<InventoryRecord[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stateFilter, setStateFilter] = useState<"all" | StockState>("all");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null") as InventoryRecord[] | null;
      setItems(Array.isArray(saved) && saved.length ? saved : inventorySeed);
    } catch { setItems(inventorySeed); }
  }, []);

  const persist = (next: InventoryRecord[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };
  const update = (sku: string, patch: Partial<InventoryRecord>) => {
    persist(items.map((item) => item.sku === sku ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));
  };
  const reset = () => {
    if (!window.confirm(ar ? "إعادة المخزون التجريبي؟" : "Reset demo inventory?")) return;
    localStorage.removeItem(KEY);
    setItems(inventorySeed);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const hay = [item.sku, item.brand, item.model, item.name.ar, item.name.en].join(" ").toLowerCase();
      return hay.includes(q) && (category === "all" || item.categoryId === category) && (stateFilter === "all" || item.state === stateFilter);
    });
  }, [items, query, category, stateFilter]);

  const stats = {
    products: items.length,
    available: items.filter((x) => x.state === "available").length,
    onRequest: items.filter((x) => x.state === "on-request").length,
    low: items.filter((x) => x.quantity <= x.reorderLevel).length,
  };

  const exportCsv = () => {
    const headers = ["SKU","Name","Category","Brand","Model","Unit","Quantity","Reorder Level","State","Updated At"];
    const esc = (v: unknown) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
    const rows = items.map((x) => [x.sku, ar ? x.name.ar : x.name.en, x.categoryId, x.brand, x.model, x.unit, x.quantity, x.reorderLevel, x.state, x.updatedAt].map(esc).join(","));
    const blob = new Blob(["\uFEFF" + [headers.map(esc).join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "az-inventory-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stateLabel = (s: StockState) => ({ available: ar ? "متاح" : "Available", "on-request": ar ? "حسب الطلب" : "On request", "out-of-stock": ar ? "غير متاح" : "Out of stock" }[s]);
  const unitLabel = (u: InventoryRecord["unit"]) => ({ piece: ar ? "قطعة" : "piece", meter: ar ? "متر" : "meter", set: ar ? "طقم" : "set", service: ar ? "خدمة" : "service" }[u]);

  return <>
    <PageIntro icon={Package}
      eyebrow={{ ar: "إدارة المنتجات — وضع المعاينة", en: "Product Inventory — Preview Mode" }}
      title={{ ar: "المخزون والمنتجات", en: "Inventory & Products" }}
      description={{ ar: "هيكل محلي لإدارة SKU والكميات وحالة التوفر. يمكن نقله لاحقًا إلى قاعدة بيانات.", en: "A local product structure for SKU, quantities and availability, ready to move to a database later." }}
    />
    <section className="bg-secondary py-10 md:py-14"><div className="container-shell">
      <div className="mb-5 rounded-2xl border border-border bg-card p-4 text-sm leading-7">
        <strong>{ar ? "وضع المعاينة:" : "Preview mode:"}</strong> {ar ? "الأرقام الحالية تجريبية ولا تمثل مخزونًا فعليًا. لا يتم عرض أسعار أو توافر حقيقي قبل ربط قاعدة البيانات." : "Current records are demo data and do not represent real stock. No real pricing or availability is claimed before a database connection."}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["products", ar ? "المنتجات" : "Products", stats.products],["available", ar ? "متاح" : "Available", stats.available],["onRequest", ar ? "حسب الطلب" : "On request", stats.onRequest],["low", ar ? "عند حد إعادة الطلب" : "At reorder level", stats.low]].map(([k,l,v]) => <div key={String(k)} className="stat-card"><p className="text-sm text-muted-foreground">{l}</p><p className="mt-2 text-3xl font-black">{v}</p></div>)}
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1"><Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={ar ? "ابحث بالـ SKU أو الموديل أو العلامة..." : "Search SKU, model or brand..."} className="h-11 w-full rounded-md border border-input bg-background px-10 text-sm outline-none focus:ring-2 focus:ring-ring"/></div>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm"><option value="all">{ar ? "كل الفئات" : "All categories"}</option>{catalog.map((x)=><option key={x.categoryId} value={x.categoryId}>{ar?x.title.ar:x.title.en}</option>)}</select>
          <select value={stateFilter} onChange={(e)=>setStateFilter(e.target.value as "all" | StockState)} className="h-11 rounded-md border border-input bg-background px-3 text-sm"><option value="all">{ar ? "كل الحالات" : "All states"}</option><option value="available">{stateLabel("available")}</option><option value="on-request">{stateLabel("on-request")}</option><option value="out-of-stock">{stateLabel("out-of-stock")}</option></select>
          <Button variant="outline" onClick={exportCsv}><Download/>{ar?"CSV":"CSV"}</Button><Button variant="outline" onClick={reset}><RotateCcw/>{ar?"إعادة":"Reset"}</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{ar ? "عرض " + filtered.length + " من " + items.length : "Showing " + filtered.length + " of " + items.length}</p>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b border-border bg-secondary/70"><tr>{(ar?["SKU","المنتج","العلامة","الموديل","الوحدة","الكمية","حد الطلب","الحالة","حفظ"]:["SKU","Product","Brand","Model","Unit","Qty","Reorder","State","Save"]).map(h=><th key={h} className="px-4 py-3 text-start font-bold">{h}</th>)}</tr></thead>
          <tbody>{filtered.map((item)=><tr key={item.sku} className="border-b border-border last:border-0">
            <td className="px-4 py-3 font-bold">{item.sku}</td><td className="px-4 py-3">{ar?item.name.ar:item.name.en}</td><td className="px-4 py-3">{item.brand}</td><td className="px-4 py-3">{item.model}</td><td className="px-4 py-3">{unitLabel(item.unit)}</td>
            <td className="px-4 py-3"><div className="flex items-center gap-1"><button className="rounded border p-1" onClick={()=>update(item.sku,{quantity:Math.max(0,item.quantity-1)})}><Minus className="h-3 w-3"/></button><input type="number" min="0" value={item.quantity} onChange={(e)=>update(item.sku,{quantity:Math.max(0,Number(e.target.value)||0)})} className="w-16 rounded border border-input bg-background px-2 py-1 text-center"/><button className="rounded border p-1" onClick={()=>update(item.sku,{quantity:item.quantity+1})}><Plus className="h-3 w-3"/></button></div></td>
            <td className="px-4 py-3"><input type="number" min="0" value={item.reorderLevel} onChange={(e)=>update(item.sku,{reorderLevel:Math.max(0,Number(e.target.value)||0)})} className="w-16 rounded border border-input bg-background px-2 py-1 text-center"/></td>
            <td className="px-4 py-3"><select value={item.state} onChange={(e)=>update(item.sku,{state:e.target.value as StockState})} className="rounded border border-input bg-background px-2 py-1"><option value="available">{stateLabel("available")}</option><option value="on-request">{stateLabel("on-request")}</option><option value="out-of-stock">{stateLabel("out-of-stock")}</option></select></td>
            <td className="px-4 py-3"><span title={ar?"يتم الحفظ تلقائيًا":"Auto-saved"} className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Save className="h-3.5 w-3.5"/>{ar?"محفوظ":"Saved"}</span></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div></section>
  </>;
}

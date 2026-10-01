import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Search, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site-sections";
import { useLanguage } from "@/components/language-provider";
import { catalog } from "@/lib/catalog";

export const Route = createFileRoute("/catalog")({
  component: CatalogPage,
  head: () => ({ meta: [
    { title: "Solutions Catalog | AZ Solution BNS" },
    { name: "description", content: "Browse AZ Solution technology categories and request a tailored quotation." },
  ] }),
});

function CatalogPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      try { setSelected(JSON.parse(localStorage.getItem("az-quote-items") || "[]") as string[]); }
      catch { setSelected([]); }
    };
    load();
    window.addEventListener("az-quote-updated", load);
    return () => window.removeEventListener("az-quote-updated", load);
  }, []);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    return catalog.map((item) => item.category).filter((item) => {
      const key = item.en;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    return catalog.filter((item) => {
      const matchesCategory = category === "all" || item.category.en === category;
      const haystack = [
        item.title.ar, item.title.en, item.description.ar, item.description.en,
        item.category.ar, item.category.en,
      ].join(" ").toLowerCase();
      return matchesCategory && haystack.includes(query);
    });
  }, [q, category]);

  const Arrow = ar ? ArrowLeft : ArrowRight;
  const stockLabel = (state: string) => ({ available: ar ? "متاح" : "Available", "on-request": ar ? "حسب الطلب" : "On request", "out-of-stock": ar ? "غير متاح" : "Out of stock" }[state] || state);
  const unitLabel = (unit: string) => ({ piece: ar ? "قطعة" : "piece", meter: ar ? "متر" : "meter", set: ar ? "طقم" : "set", service: ar ? "خدمة" : "service" }[unit] || unit);

  const addToRequest = (title: string) => {
    if (selected.includes(title)) return;
    const next = [...selected, title];
    setSelected(next);
    localStorage.setItem("az-quote-items", JSON.stringify(next));
    window.dispatchEvent(new Event("az-quote-updated"));
  };

  const removeAll = () => {
    setSelected([]);
    localStorage.removeItem("az-quote-items");
    window.dispatchEvent(new Event("az-quote-updated"));
  };

  return <>
    <PageIntro
      eyebrow={{ ar: "كتالوج الحلول", en: "Solutions Catalog" }}
      title={{ ar: "اختار الفئة، ونحن نحدد المواصفات", en: "Choose a category, we define the specification" }}
      description={{ ar: "تصفح الفئات التقنية وأرسل طلبك للحصول على نطاق ومواصفات مناسبة.", en: "Browse technology categories and request a tailored scope and specification." }}
    />

    <section className="py-16 md:py-24">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={ar ? "ابحث عن منتج أو فئة..." : "Search products or categories..."}
              className="h-12 w-full rounded-xl border border-input bg-background ps-10 pe-4 outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setCategory("all")}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${category === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"}`}>
              {ar ? "كل الفئات" : "All categories"}
            </button>
            {categories.map((item) => (
              <button key={item.en} type="button" onClick={() => setCategory(item.en)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${category === item.en ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent"}`}>
                {ar ? item.ar : item.en}
              </button>
            ))}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-tech/20 bg-tech-soft p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-card text-tech"><ShoppingCart className="size-4" /></span>
              <div>
                <p className="font-bold">{ar ? `تم اختيار ${selected.length} عنصر` : `${selected.length} item(s) selected`}</p>
                <p className="text-xs text-muted-foreground">{ar ? "يمكنك مراجعة العناصر قبل إرسال طلب عرض السعر." : "Review your selected items before submitting a quote request."}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild><Link to="/quote">{ar ? "مراجعة الطلب" : "Review request"}<Arrow /></Link></Button>
              <Button variant="ghost" onClick={removeAll}>{ar ? "مسح" : "Clear"}</Button>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ slug, title, category: itemCategory, description, icon: Icon }) => {
            const itemTitle = ar ? title.ar : title.en;
            const itemSku = `${catalog.find((x) => x.slug === slug)?.skuPrefix || "AZ"}-${slug.toUpperCase()}`;
            const item = catalog.find((x) => x.slug === slug)!;
            const isSelected = selected.includes(itemTitle);
            return (
              <article key={slug} className="content-card p-7">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-tech-soft text-tech"><Icon className="size-5" /></span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold">{ar ? itemCategory.ar : itemCategory.en}</span>
                </div>
                <h2 className="mt-6 text-lg font-bold">{itemTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{ar ? description.ar : description.en}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold"><span className="rounded-full border border-border px-2.5 py-1">SKU: {itemSku}</span><span className="rounded-full border border-border px-2.5 py-1">{stockLabel(item.stockState)}</span><span className="rounded-full border border-border px-2.5 py-1">{unitLabel(item.unit)}</span></div>
                <p className="mt-3 text-xs text-muted-foreground">{ar ? "العلامات: " : "Brands: "}{item.brands.join(" · ")}</p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <Button type="button" variant={isSelected ? "secondary" : "default"} onClick={() => addToRequest(itemTitle)} disabled={isSelected}>
                    {isSelected ? <><Check />{ar ? "تمت الإضافة" : "Added"}</> : ar ? "أضف للطلب" : "Add to request"}
                  </Button>
                  <Button asChild variant="outline"><Link to="/quote">{ar ? "عرض السعر" : "Quote"}<Arrow /></Link></Button>
                </div>
              </article>
            );
          })}
        </div>

        {!items.length && <p className="mt-12 text-center text-muted-foreground">{ar ? "لا توجد نتائج. جرّب كلمة أخرى أو فئة مختلفة." : "No results. Try another search or category."}</p>}
      </div>
    </section>
  </>;
}

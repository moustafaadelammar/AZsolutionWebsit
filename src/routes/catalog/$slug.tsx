import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Package, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { catalog } from "@/lib/catalog";

export const Route = createFileRoute("/catalog/$slug")({
  component: ProductDetailPage,
  head: ({ params }) => {
    const item = catalog.find((x) => x.slug === params.slug);
    return { meta: [{ title: item ? item.title.en + " | AZ Solution BNS" : "Catalog | AZ Solution BNS" }] };
  },
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { language } = useLanguage();
  const ar = language === "ar";
  const item = catalog.find((x) => x.slug === slug);
  const [selected, setSelected] = useState(false);
  if (!item) return <section className="py-24"><div className="container-shell text-center"><h1 className="text-3xl font-bold">404</h1><Button asChild className="mt-6"><Link to="/catalog">{ar ? "العودة للكتالوج" : "Back to catalog"}</Link></Button></div></section>;

  const title = ar ? item.title.ar : item.title.en;
  const description = ar ? item.description.ar : item.description.en;
  const category = ar ? item.category.ar : item.category.en;
  const add = () => {
    const existing = JSON.parse(localStorage.getItem("az-quote-items") || "[]") as string[];
    if (!existing.includes(title)) {
      localStorage.setItem("az-quote-items", JSON.stringify([...existing, title]));
      window.dispatchEvent(new Event("az-quote-updated"));
    }
    setSelected(true);
  };
  const stock = { available: ar ? "متاح" : "Available", "on-request": ar ? "حسب الطلب" : "On request", "out-of-stock": ar ? "غير متاح" : "Out of stock" }[item.stockState];
  const unit = { piece: ar ? "قطعة" : "piece", meter: ar ? "متر" : "meter", set: ar ? "طقم" : "set", service: ar ? "خدمة" : "service" }[item.unit];
  const Arrow = ar ? ArrowLeft : ArrowRight;

  return <>
    <section className="bg-secondary py-14 md:py-20">
      <div className="container-shell">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><Arrow />{ar ? "العودة للكتالوج" : "Back to catalog"}</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-tech-soft text-tech"><item.icon className="size-7" /></span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{category}</span>
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-tech">AZ Solution · {item.skuPrefix}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{description}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {item.models.map((model) => <span key={model} className="rounded-full border border-border px-3 py-2 text-xs font-semibold">{model}</span>)}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={add}>{selected ? <><CheckCircle2 />{ar ? "تمت الإضافة للطلب" : "Added to request"}</> : <><ShoppingCart />{ar ? "أضف للطلب" : "Add to request"}</>}</Button>
              <Button asChild variant="outline" size="lg"><Link to="/quote">{ar ? "اطلب عرض سعر" : "Request a quote"}<Arrow /></Link></Button>
            </div>
          </div>
          <aside className="rounded-3xl bg-ink p-7 text-ink-foreground md:p-9">
            <p className="text-xs font-bold uppercase tracking-widest text-tech-bright">{ar ? "بيانات المنتج" : "Product information"}</p>
            <dl className="mt-7 grid gap-5">
              <div><dt className="text-xs text-ink-muted">SKU Prefix</dt><dd className="mt-1 font-bold">{item.skuPrefix}</dd></div>
              <div><dt className="text-xs text-ink-muted">{ar ? "الوحدة" : "Unit"}</dt><dd className="mt-1 font-bold">{unit}</dd></div>
              <div><dt className="text-xs text-ink-muted">{ar ? "التوفر" : "Availability"}</dt><dd className="mt-1 font-bold">{stock}</dd></div>
              <div><dt className="text-xs text-ink-muted">{ar ? "العلامات المتاحة" : "Brand options"}</dt><dd className="mt-1 font-bold leading-7">{item.brands.join(" · ")}</dd></div>
            </dl>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-ink-muted">{ar ? "الموديل النهائي والمواصفات والكميات يتم تحديدها حسب الموقع والاحتياج قبل إصدار عرض السعر." : "Final model, specification and quantity are confirmed against the site requirements before quotation."}</div>
          </aside>
        </div>
      </div>
    </section>
  </>;
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site-sections";
import { useLanguage } from "@/components/language-provider";
import { catalog } from "@/lib/catalog";

export const Route = createFileRoute("/catalog")({component:CatalogPage,head:()=>({meta:[{title:"Solutions Catalog | AZ Solution BNS"},{name:"description",content:"Browse AZ Solution technology categories and request a tailored quotation."}]})});

function CatalogPage(){
 const {language}=useLanguage(); const ar=language==="ar"; const [q,setQ]=useState("");
 const items=useMemo(()=>catalog.filter(x=>((x.title.ar+" "+x.title.en+" "+x.description.ar+" "+x.description.en).toLowerCase()).includes(q.toLowerCase())),[q]);
 const Arrow=ar?ArrowLeft:ArrowRight;
 return <><PageIntro eyebrow={{ar:"كتالوج الحلول",en:"Solutions Catalog"}} title={{ar:"اختار الفئة، ونحن نحدد المواصفات",en:"Choose a category, we define the specification"}} description={{ar:"تصفح الفئات التقنية وأرسل طلبك للحصول على نطاق ومواصفات مناسبة.",en:"Browse technology categories and request a tailored scope and specification."}}/><section className="py-16 md:py-24"><div className="container-shell"><div className="relative mx-auto max-w-xl"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={ar?"ابحث عن منتج أو فئة...":"Search products or categories..."} className="h-12 w-full rounded-xl border border-input bg-background ps-10 pe-4 outline-none focus:ring-2 focus:ring-ring"/></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(({slug,title,category,description,icon:Icon})=><article key={slug} className="content-card p-7"><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-xl bg-tech-soft text-tech"><Icon className="size-5"/></span><span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold">{ar?category.ar:category.en}</span></div><h2 className="mt-6 text-lg font-bold">{ar?title.ar:title.en}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{ar?description.ar:description.en}</p><Button asChild variant="outline" className="mt-6 w-full"><Link to="/quote">{ar?"اطلب عرض سعر لهذه الفئة":"Request a quote"}<Arrow/></Link></Button></article>)}</div>{!items.length&&<p className="mt-12 text-center text-muted-foreground">{ar?"لا توجد نتائج. جرّب كلمة أخرى.":"No results. Try another search."}</p>}</div></section></>;
}
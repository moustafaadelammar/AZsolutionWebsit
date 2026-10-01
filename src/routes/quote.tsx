import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FileText, Upload } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro } from "@/components/site-sections";
import { useLanguage } from "@/components/language-provider";

export const Route = createFileRoute("/quote")({ head: () => ({ meta: [
  { title: "Request a Quote | AZ Solution BNS" }, { name: "description", content: "Request a tailored quote for networking, servers, CCTV, access control, VoIP, UPS, IT supplies or technical support." }, { property: "og:title", content: "Request a Quote | AZ Solution BNS" }, { property: "og:description", content: "Tell AZ Solution about your technology requirements through a structured quote request." }, { property: "og:type", content: "website" }, { property: "og:url", content: "/quote" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/quote" }] }), component: QuotePage });

type Errors = Partial<Record<"name" | "phone" | "email" | "service" | "details" | "file", string>>;
function QuotePage() {
  const { language } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  useEffect(() => { const load=()=>setSelectedItems(JSON.parse(localStorage.getItem("az-quote-items")||"[]") as string[]); load(); window.addEventListener("az-quote-updated",load); return ()=>window.removeEventListener("az-quote-updated",load); }, []);
  const ar = language === "ar";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Errors = {};
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const service = String(form.get("service") ?? "");
    const details = String(form.get("details") ?? "").trim();
    const selected = selectedItems.length ? `\nSelected categories: ${selectedItems.join(", ")}` : "";
    const file = form.get("file");
    if (name.length < 2) next.name = ar ? "أدخل الاسم أو اسم الشركة." : "Enter a person or company name.";
    if (!/^\+?[0-9\s()-]{7,20}$/.test(phone)) next.phone = ar ? "أدخل رقم هاتف صالحاً." : "Enter a valid phone number.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = ar ? "أدخل بريداً إلكترونياً صالحاً." : "Enter a valid email address.";
    if (!service) next.service = ar ? "اختر الخدمة المطلوبة." : "Select a service.";
    if ((details + selected).length < 20) next.details = ar ? "أضف تفاصيل أوضح للمشروع (20 حرفاً على الأقل)." : "Add more project detail (at least 20 characters).";
    if (file instanceof File && file.size > 5 * 1024 * 1024) next.file = ar ? "الحد الأقصى للملف 5 ميجابايت." : "Maximum file size is 5 MB.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      const leadId = `AZ-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
      const lead = { id: leadId, createdAt: new Date().toISOString(), name, phone, email, service, details, selectedItems };
      const existingLeads = JSON.parse(localStorage.getItem("az-leads") || "[]") as typeof lead[];
      localStorage.setItem("az-leads", JSON.stringify([lead, ...existingLeads].slice(0, 100)));
      localStorage.setItem("az-last-lead", JSON.stringify(lead));
      localStorage.setItem("az-last-lead-id", leadId);
      localStorage.removeItem("az-quote-items");
      setSuccess(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
  }
  if (success) return <section className="min-h-[70vh] bg-secondary py-20"><div className="container-shell"><div className="mx-auto max-w-2xl border border-border bg-card p-8 text-center shadow-elevated md:p-12"><span className="mx-auto grid size-16 place-items-center rounded-full bg-tech-soft text-tech"><CheckCircle2 className="size-8" /></span><h1 className="mt-6 text-3xl font-bold">{ar ? "تم تجهيز طلبك" : "Your request is ready"}</h1><p className="mt-4 leading-8 text-muted-foreground">{ar ? `تم التحقق من البيانات بنجاح. رقم الطلب المحلي: ${localStorage.getItem("az-last-lead-id") ?? "—"}. ` : `Your request passed validation. Local request ID: ${localStorage.getItem("az-last-lead-id") ?? "—"}. `}<span className="text-muted-foreground">{ar ? "لم يتم إرسالها خارج الموقع لأن وسيلة الاستقبال الرسمية غير مضافة بعد. أضف بيانات الاتصال أو اربط النظام لاحقاً لإتمام الإرسال." : "Nothing was sent externally because an official recipient is not configured yet. Add contact details or connect a CRM later to enable delivery."}</span></p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Button type="button" onClick={() => { const lead=JSON.parse(localStorage.getItem("az-last-lead")||"{}"); const text=[`AZ Solution — ${lead.id||""}`, `Name: ${lead.name||""}`, `Phone: ${lead.phone||""}`, `Email: ${lead.email||""}`, `Service: ${lead.service||""}`, `Selected: ${(lead.selectedItems||[]).join(", ")}`, `Details: ${lead.details||""}`].join("\n"); navigator.clipboard?.writeText(text); }}>{ar ? "نسخ ملخص الطلب" : "Copy request summary"}</Button><Button type="button" variant="outline" onClick={() => setSuccess(false)}>{ar ? "تعديل الطلب" : "Edit request"}</Button></div></div></div></section>;
  const fieldClass = "mt-2 h-11 bg-background";
  return <><PageIntro icon={FileText} eyebrow={{ ar: "طلب عرض سعر", en: "Request a Quote" }} title={{ ar: "شاركنا تفاصيل احتياجك", en: "Tell us what your business needs" }} description={{ ar: "كلما كانت التفاصيل أوضح، أصبح من السهل تحديد نطاق العمل والمواصفات المناسبة.", en: "The clearer the details, the easier it is to define the right scope and specifications." }} /><section className="bg-secondary py-16 md:py-24"><div className="container-shell"><form onSubmit={submit} noValidate className="mx-auto max-w-4xl border border-border bg-card p-6 shadow-sm md:p-10"><div className="grid gap-6 sm:grid-cols-2"><Field id="name" label={ar ? "اسم الشركة أو الشخص *" : "Company or person name *"} error={errors.name}><Input id="name" name="name" autoComplete="organization" className={fieldClass} aria-invalid={!!errors.name} /></Field><Field id="phone" label={ar ? "الهاتف / واتساب *" : "Phone / WhatsApp *"} error={errors.phone}><Input id="phone" name="phone" type="tel" autoComplete="tel" dir="ltr" className={fieldClass} aria-invalid={!!errors.phone} /></Field><Field id="email" label={ar ? "البريد الإلكتروني" : "Email"} error={errors.email}><Input id="email" name="email" type="email" autoComplete="email" dir="ltr" className={fieldClass} aria-invalid={!!errors.email} /></Field><Field id="service" label={ar ? "الخدمة / الفئة *" : "Service / category *"} error={errors.service}><select id="service" name="service" defaultValue="" className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" aria-invalid={!!errors.service}><option value="" disabled>{ar ? "اختر فئة" : "Select a category"}</option>{["Infrastructure","Networking","Servers & Storage","CCTV & Security","Access Control","VoIP","UPS & Supplies","Maintenance & Support","Safety Supplies"].map((value) => <option key={value} value={value}>{value}</option>)}</select></Field></div>{selectedItems.length > 0 && <div className="mb-6 rounded-xl border border-border bg-secondary p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold">{ar ? "العناصر المضافة للطلب" : "Items added to your request"}</p><p className="mt-1 text-xs text-muted-foreground">{ar ? "سيتم تضمينها ضمن نطاق عرض السعر." : "They will be included in the quotation scope."}</p></div><button type="button" className="text-xs font-semibold text-muted-foreground underline" onClick={() => {localStorage.removeItem("az-quote-items"); setSelectedItems([]);}}>{ar ? "مسح" : "Clear"}</button></div><div className="mt-4 flex flex-wrap gap-2">{selectedItems.map(item=><span key={item} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-medium">{item}</span>)}</div></div>}<div className="mt-6"><Field id="details" label={ar ? "تفاصيل المشروع *" : "Project details *"} error={errors.details}><Textarea id="details" name="details" rows={7} className="mt-2 bg-background" placeholder={ar ? "الموقع، العدد التقريبي، الوضع الحالي، والهدف المطلوب..." : "Site, estimated quantity, current setup, and desired outcome..."} aria-invalid={!!errors.details} /></Field></div><div className="mt-6"><Field id="file" label={ar ? "ملف مساعد (اختياري)" : "Supporting file (optional)"} error={errors.file}><label htmlFor="file" className="mt-2 flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-input bg-background p-5 text-sm text-muted-foreground hover:border-primary"><Upload className="size-5 text-tech"/><span>{ar ? "PDF أو صورة أو ملف مستند — بحد أقصى 5 ميجابايت" : "PDF, image, or document — maximum 5 MB"}</span><Input id="file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" className="sr-only" /></label></Field></div><div className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-[1fr_auto] sm:items-center"><div className="flex items-start gap-3"><span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-tech-soft text-tech"><CheckCircle2 className="size-4" /></span><p className="max-w-xl text-xs leading-6 text-muted-foreground">{ar ? "سيتم استخدام هذه البيانات لتجهيز نطاق العمل. النموذج يعمل محلياً حالياً ولا يرسل البيانات خارج الموقع حتى يتم ربط قناة استقبال رسمية." : "These details are used to prepare the project scope. The form currently works locally and does not transmit data until an official receiving channel is connected."}</p></div><Button type="submit" size="lg">{ar ? "تجهيز طلب عرض السعر" : "Prepare quote request"}</Button></div></form></div></section></>;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) { return <div><Label htmlFor={id}>{label}</Label>{children}{error && <p className="mt-2 text-xs font-medium text-destructive" role="alert">{error}</p>}</div>; }
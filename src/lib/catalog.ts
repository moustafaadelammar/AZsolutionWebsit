import type { ContentItem, LocalText } from "./site-data";
import { Cable, Camera, HardDrive, KeyRound, Network, Router, Server, ShieldCheck, Zap } from "lucide-react";

export type CatalogCategory = "networking" | "servers-storage" | "firewalls" | "cctv" | "access-control" | "ups" | "cabling" | "storage" | "routers";
export type StockState = "available" | "on-request" | "out-of-stock";

export type CatalogItem = ContentItem & {
  slug: string;
  category: LocalText;
  categoryId: CatalogCategory;
  featured?: boolean;
  skuPrefix: string;
  brands: string[];
  unit: "piece" | "meter" | "set" | "service";
  stockState: StockState;
  models: string[];
};

export const catalog: CatalogItem[] = [
 {slug:"networking",title:{ar:"معدات الشبكات",en:"Networking Equipment"},category:{ar:"شبكات",en:"Networking"},categoryId:"networking",description:{ar:"سويتشات وراوترات ونقاط وصول وملحقات ربط للمؤسسات.",en:"Switches, routers, access points and connectivity accessories for organizations."},icon:Network,featured:true,skuPrefix:"NET",brands:["Cisco","Fortinet","HPE","Ubiquiti"],unit:"piece",stockState:"on-request",models:["Access Switch","Core Switch","Router","Access Point"]},
 {slug:"servers-storage",title:{ar:"الخوادم والتخزين",en:"Servers & Storage"},category:{ar:"بنية تحتية",en:"Infrastructure"},categoryId:"servers-storage",description:{ar:"خوادم وتخزين وملحقات مراكز البيانات حسب الحمل والاحتياج.",en:"Servers, storage and data-center accessories sized to your workload."},icon:Server,featured:true,skuPrefix:"SRV",brands:["Dell","HPE","Lenovo","QNAP"],unit:"piece",stockState:"on-request",models:["Rack Server","Tower Server","NAS","Server SSD"]},
 {slug:"firewalls",title:{ar:"الجدران النارية",en:"Firewalls"},category:{ar:"أمن الشبكات",en:"Network Security"},categoryId:"firewalls",description:{ar:"حلول حماية الشبكات وإدارة الوصول والاتصال الآمن.",en:"Network protection, access control and secure connectivity solutions."},icon:ShieldCheck,featured:true,skuPrefix:"FW",brands:["Fortinet","Cisco","Sophos"],unit:"piece",stockState:"on-request",models:["Next-Generation Firewall","VPN Gateway","UTM Appliance"]},
 {slug:"cctv",title:{ar:"كاميرات المراقبة",en:"CCTV Systems"},category:{ar:"أمن ومراقبة",en:"Security"},categoryId:"cctv",description:{ar:"كاميرات ومسجلات وتخزين ومستلزمات تركيب للمواقع.",en:"Cameras, recorders, storage and installation accessories."},icon:Camera,featured:true,skuPrefix:"CCTV",brands:["Hikvision","Dahua","Uniview"],unit:"piece",stockState:"on-request",models:["IP Camera","NVR","HDD","PoE Switch"]},
 {slug:"access-control",title:{ar:"التحكم في الدخول",en:"Access Control"},category:{ar:"أمن ومراقبة",en:"Security"},categoryId:"access-control",description:{ar:"أجهزة تحكم في الأبواب والحضور وإدارة صلاحيات الدخول.",en:"Door control, attendance and access-permission systems."},icon:KeyRound,skuPrefix:"ACS",brands:["Hikvision","ZKTeco","Dahua"],unit:"set",stockState:"on-request",models:["Door Controller","Reader","Attendance Terminal","Lock"]},
 {slug:"ups",title:{ar:"UPS والطاقة الاحتياطية",en:"UPS & Backup Power"},category:{ar:"استمرارية التشغيل",en:"Continuity"},categoryId:"ups",description:{ar:"حلول حماية الطاقة للأجهزة والخوادم والشبكات.",en:"Power protection for servers, networks and critical equipment."},icon:Zap,skuPrefix:"UPS",brands:["APC","Eaton","Vertiv"],unit:"piece",stockState:"on-request",models:["Line Interactive UPS","Online UPS","Rack UPS"]},
 {slug:"cabling",title:{ar:"الكابلات والملحقات",en:"Cabling & Accessories"},category:{ar:"توريدات",en:"Supplies"},categoryId:"cabling",description:{ar:"كابلات شبكة وراك وPatch Panels وملحقات تنفيذ.",en:"Network cabling, racks, patch panels and deployment accessories."},icon:Cable,skuPrefix:"CAB",brands:["Panduit","CommScope","Nexans"],unit:"meter",stockState:"available",models:["Cat6 Cable","Fiber Cable","Patch Panel","Rack"]},
 {slug:"storage",title:{ar:"وحدات التخزين",en:"Storage Solutions"},category:{ar:"تخزين",en:"Storage"},categoryId:"storage",description:{ar:"تخزين شبكي ووحدات أقراص وحلول توسعة للمؤسسات.",en:"Network storage, drives and scalable storage expansion."},icon:HardDrive,skuPrefix:"STR",brands:["QNAP","Synology","Seagate","WD"],unit:"piece",stockState:"on-request",models:["NAS","SATA HDD","Enterprise SSD","Expansion Unit"]},
 {slug:"routers",title:{ar:"الراوترات",en:"Routers"},category:{ar:"شبكات",en:"Networking"},categoryId:"routers",description:{ar:"حلول ربط الإنترنت والفروع وتوجيه حركة الشبكة.",en:"Internet, branch connectivity and routing solutions."},icon:Router,skuPrefix:"RTR",brands:["Cisco","MikroTik","Fortinet","TP-Link"],unit:"piece",stockState:"on-request",models:["Branch Router","VPN Router","4G/5G Router"]}
];

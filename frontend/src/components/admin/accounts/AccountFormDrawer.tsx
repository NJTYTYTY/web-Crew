"use client";

import React, { useEffect, useState } from "react";
import { AdminGameAccount, INITIAL_GAME_ACCOUNTS } from "@/data/mockAdminData";
import { useLanguage } from "@/context/LanguageContext";

interface AccountFormDrawerProps {
  open: boolean;
  editingAccount: AdminGameAccount | null;
  onClose: () => void;
  onSave: (data: Omit<AdminGameAccount, "id" | "code">, isDraft?: boolean) => void;
}

const ACCOUNT_IMG_PRESETS = [
  { label: "Roblox #1", url: "/game-account_sale/roblox01.png" }, { label: "Roblox #2", url: "/game-account_sale/roblox02.png" }, { label: "Roblox #3", url: "/game-account_sale/roblox03.png" },
  { label: "RoV #1", url: "/game-account_sale/rov1.png" }, { label: "RoV #2", url: "/game-account_sale/rov2.png" }, { label: "RoV #3", url: "/game-account_sale/rov3.png" },
];

export default function AccountFormDrawer({ open, editingAccount, onClose, onSave }: AccountFormDrawerProps) {
  const { tx } = useLanguage();
  const [platform, setPlatform] = useState<string>("roblox");
  const [customPlatform, setCustomPlatform] = useState("");
  const [isCustomPlatform, setIsCustomPlatform] = useState(false);
  const [title, setTitle] = useState("");
  const [priceThb, setPriceThb] = useState("450");
  const [spec1, setSpec1] = useState("");
  const [spec2, setSpec2] = useState("");
  const [spec3, setSpec3] = useState("");
  const [serverRegion, setServerRegion] = useState("Global / SEA Optimized");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/game-account_sale/roblox01.png");
  const [tags, setTags] = useState<string[]>(["Human V4 T10", "CDK + 6 Melee", "Clean ID"]);
  const [tagInput, setTagInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [emailStatus, setEmailStatus] = useState("100% Clean ID (No Phone / No Email Linked)");
  const [status, setStatus] = useState<"available" | "sold">("available");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (editingAccount) {
      const p = editingAccount.platform.toLowerCase();
      if (p === "roblox" || p === "rov" || p === "freefire" || p === "valorant") {
        setPlatform(p);
        setIsCustomPlatform(false);
      } else {
        setPlatform(p);
        setCustomPlatform(editingAccount.platformLabel || p);
        setIsCustomPlatform(true);
      }
      setTitle(editingAccount.title);
      setPriceThb(String(editingAccount.priceThb));
      setSpec1(editingAccount.spec1);
      setSpec2(editingAccount.spec2);
      setSpec3(editingAccount.spec3);
      setServerRegion(editingAccount.serverRegion || (editingAccount.platform === "rov" ? "Garena Thailand (TH)" : "Global / SEA Optimized"));
      setDescription(editingAccount.description || "");
      setImageUrl(editingAccount.imageUrl || "/game-account_sale/roblox01.png");
      setTags(editingAccount.tags);
      setUsername(editingAccount.username);
      setPassword(editingAccount.password);
      setPin(editingAccount.pin === "None" ? "" : editingAccount.pin);
      setEmailStatus(editingAccount.subtitle || "100% Clean ID (No Phone / No Email Linked)");
      setStatus(editingAccount.status);
    } else {
      setPlatform("roblox"); setCustomPlatform(""); setIsCustomPlatform(false); setTitle(""); setPriceThb("450"); setSpec1(""); setSpec2(""); setSpec3("");
      setServerRegion("Global / SEA Optimized"); setDescription(""); setImageUrl("/game-account_sale/roblox01.png");
      setTags(["Human V4 T10", "CDK + 6 Melee", "Clean ID"]); setUsername(""); setPassword(""); setPin("");
      setEmailStatus("100% Clean ID (No Phone / No Email Linked)"); setStatus("available");
    }
  }, [editingAccount, open]);

  if (!open) return null;

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = (isDraft = false) => {
    if (!title.trim()) {
      alert("Please enter account title");
      return;
    }
    const numPrice = Number(priceThb);
    if (!numPrice || numPrice <= 0) {
      alert("Please enter a valid price in THB (> 0)");
      return;
    }
    if (!username.trim()) {
      alert("Please enter account login username");
      return;
    }
    if (!password.trim()) {
      alert("Please enter account login password");
      return;
    }

    const activePlatform = (isCustomPlatform && customPlatform.trim() ? customPlatform.trim() : platform).toLowerCase();
    const platformLabel = isCustomPlatform && customPlatform.trim()
      ? customPlatform.trim()
      : platform === "rov"
      ? "RoV (Garena)"
      : platform === "roblox"
      ? "Roblox"
      : platform.toUpperCase();

    const defaultImg = platform === "rov" ? "/game-account_sale/rov1.png" : "/game-account_sale/roblox01.png";
    onSave(
      {
        title: title.trim(),
        subtitle: emailStatus.trim() || "100% Clean ID • Instant Ownership",
        subIcon: "vpn_key",
        platform: activePlatform as any,
        platformLabel,
        spec1: spec1.trim() || (platform === "roblox" ? "Lv. 2550 (MAX)" : "Ex-Supreme Rank"),
        spec2: spec2.trim() || tags.slice(0, 2).join(" • ") || "Verified Full Access",
        spec3: spec3.trim() || tags[2] || "Instant Escrow Delivery",
        serverRegion: serverRegion.trim() || (platform === "roblox" ? "Global / SEA Optimized" : "Garena Thailand (TH)"),
        description: description.trim() || "Full access verified game account stored in AES-256 escrow vault. Instant automated credential delivery after payment.",
        imageUrl: imageUrl.trim() || defaultImg,
        priceThb: numPrice,
        priceUsd: `~ $${(numPrice / 35).toFixed(2)} USD`,
        status,
        username: username.trim(),
        password: password.trim(),
        pin: pin.trim() || "None",
        tags,
      },
      isDraft
    );
  };

  const inputCls = "h-10 px-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all";
  const vaultInputCls = "h-10 px-space-md bg-surface-container-lowest rounded-xl font-label-sm text-label-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-tertiary shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-inverse-surface/40 backdrop-blur-sm transition-opacity duration-300" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl h-full bg-surface-container-lowest shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="px-space-xl py-space-lg bg-surface-container-low flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[16px]">add_moderator</span>
              <span>{tx("Listing Wizard", "ตัวช่วยจัดการไอดีเกม")}</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              {editingAccount ? tx(`Edit Account (${editingAccount.code})`, `แก้ไขไอดี (${editingAccount.code})`) : tx("Add New Game Account", "เพิ่มไอดีเกมใหม่")}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-xl flex flex-col gap-space-lg flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div className="sm:col-span-2 flex flex-col gap-space-xs">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">{tx("Platform Category", "หมวดหมู่แพลตฟอร์มเกม")}</label>
              <div className="flex flex-wrap gap-1.5 p-1 bg-surface-container-low rounded-xl">
                {[
                  { id: "roblox", label: "Roblox", icon: "smart_toy" },
                  { id: "rov", label: "RoV", icon: "sports_esports" },
                  { id: "freefire", label: "Free Fire", icon: "local_fire_department" },
                  { id: "valorant", label: "Valorant", icon: "gamepad" },
                ].map((p) => {
                  const isSel = !isCustomPlatform && platform === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setIsCustomPlatform(false);
                        setPlatform(p.id);
                        if (p.id === "rov") setServerRegion("Garena Thailand (TH)");
                        else if (p.id === "roblox") setServerRegion("Global / SEA Optimized");
                      }}
                      className={`flex items-center justify-center gap-space-xs py-1.5 px-3 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${
                        isSel ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-medium"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsCustomPlatform(true)}
                  className={`flex items-center justify-center gap-space-xs py-1.5 px-3 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${
                    isCustomPlatform ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-medium"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>{tx("+ Other Game", "+ เกมอื่นๆ")}</span>
                </button>
              </div>
              {isCustomPlatform && (
                <input
                  type="text"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  placeholder={tx("Enter game title (e.g. Genshin Impact, Minecraft)", "พิมพ์ชื่อเกม (เช่น Genshin Impact, Minecraft)")}
                  className={inputCls}
                  required
                />
              )}
            </div>
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">{tx("Stock Status", "สถานะสินค้า")}</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as "available" | "sold")} className={inputCls}>
                <option value="available">{tx("Available (In Stock)", "พร้อมขาย (มีสินค้า)")}</option>
                <option value="sold">{tx("Sold Out", "ขายแล้ว")}</option>
              </select>
            </div>
          </div>

          {/* Account Screenshot Image Upload + URL + Presets + Preview */}
          <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wide">
                {tx("Account Screenshot / Cover Image *", "รูปภาพสกรีนช็อตไอดี (อัปโหลดไฟล์หรือใส่ URL) *")}
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-colors shadow-xs">
                <span className="material-symbols-outlined text-[15px]">upload_file</span>
                <span>{tx("Upload Image File", "อัปโหลดรูปจากเครื่อง")}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") setImageUrl(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-4 h-24 rounded-lg overflow-hidden bg-slate-900 border border-surface-container-high relative">
                <img src={imageUrl || "/game-account_sale/roblox01.png"} alt="Account preview" className="w-full h-full object-cover" />
              </div>
              <div className="sm:col-span-8 space-y-2">
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={`w-full ${vaultInputCls}`} placeholder="/game-account_sale/roblox01.png or https://..." type="text" />
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-label-sm text-[11px] text-outline mr-1">{tx("Presets:", "เลือกรูป:")}</span>
                  {ACCOUNT_IMG_PRESETS.map((p) => (
                    <button key={p.url} type="button" onClick={() => setImageUrl(p.url)} className={`px-2 py-0.5 rounded font-label-sm text-[11px] transition-colors ${imageUrl === p.url ? "bg-primary text-on-primary font-bold" : "bg-surface-container-lowest text-on-surface-variant hover:bg-primary-fixed hover:text-primary"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Listing Title *", "ชื่อรายการไอดี *")}</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Blox Fruits [Lv.2550 MAX + Human V4 T10 + CDK]" type="text" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Price in THB (฿) *", "ราคาขาย (บาท ฿) *")}</label>
                <div className="relative flex items-center">
                  <span className="absolute left-space-md font-label-md text-label-md text-outline">฿</span>
                  <input value={priceThb} onChange={(e) => setPriceThb(e.target.value)} className={`w-full pl-8 pr-space-md ${inputCls}`} placeholder="450" type="number" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Tier / Level / Rank", "ระดับเลเวล / แรงค์")}</label>
                <input value={spec1} onChange={(e) => setSpec1(e.target.value)} className={inputCls} placeholder="e.g. Lv. 2550 (MAX) or Ex-Supreme" type="text" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Server / Region", "เซิร์ฟเวอร์ / ภูมิภาค")}</label>
                <input value={serverRegion} onChange={(e) => setServerRegion(e.target.value)} className={inputCls} placeholder="e.g. Garena Thailand (TH)" type="text" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Heroes / Fruits / Characters Summary", "สรุปฮีโร่ / ผลปีศาจ / ตัวละคร")}</label>
                <input value={spec2} onChange={(e) => setSpec2(e.target.value)} className={inputCls} placeholder="e.g. 108 Heroes or Awakened Ice & Dark" type="text" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Skins / Rare Weapons Summary", "สรุปสกินแรร์ / อาวุธพิเศษ")}</label>
                <input value={spec3} onChange={(e) => setSpec3(e.target.value)} className={inputCls} placeholder="e.g. 194 Skins or CDK + 6 Melee" type="text" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Email / Security Bind Status", "สถานะการผูกอีเมล / เบอร์โทร")}</label>
              <input value={emailStatus} onChange={(e) => setEmailStatus(e.target.value)} className={inputCls} placeholder="e.g. 100% Clean ID (No Phone / No Email Linked)" type="text" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Detailed Account Description (Shown in Storefront Popup)", "รายละเอียดไอดีแบบเต็ม (แสดงในป๊อปอัปหน้าร้าน)")}</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="p-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all resize-y" placeholder={tx("Describe full inventory, rare skins, awakened fruits, bind status, and warranty...", "ระบุรายละเอียดไอเทมในคลัง สกินแรร์ ผลปีศาจตื่น สถานะการผูกเมล/เบอร์ และการรับประกัน...")} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Highlight Feature Tags (press Enter to add)", "แท็กจุดเด่นไอดี (กด Enter เพื่อเพิ่ม)")}</label>
            <div className="flex flex-wrap items-center gap-space-xs p-space-sm bg-surface-container-low rounded-xl">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-md font-label-sm text-label-sm text-primary shadow-sm">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</button>
                </span>
              ))}
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} className="bg-transparent border-0 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none px-space-xs flex-grow min-w-[120px]" placeholder={tx("+ Add tag...", "+ เพิ่มแท็ก...")} type="text" />
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">{tx("Game Username / Login ID *", "ชื่อผู้ใช้ / ไอดีเข้าเกม *")}</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} className={vaultInputCls} placeholder="e.g. blox_id6214_v4" type="text" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold flex items-center justify-between">
                  <span>{tx("Account Password *", "รหัสผ่านไอดี *")}</span>
                  <button type="button" onClick={() => setShowPwd((p) => !p)} className="text-tertiary hover:underline font-label-sm text-label-sm inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">{showPwd ? "visibility_off" : "visibility"}</span>
                    <span>{showPwd ? tx("Hide", "ซ่อน") : tx("Show", "แสดง")}</span>
                  </button>
                </label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full ${vaultInputCls}`} placeholder="••••••••••••" type={showPwd ? "text" : "password"} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-space-xl py-space-lg bg-surface-container-low flex items-center justify-between shrink-0">
          <button type="button" onClick={onClose} className="px-space-lg py-space-sm rounded-xl font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container transition-colors whitespace-nowrap">{tx("Cancel", "ยกเลิก")}</button>
          <div className="flex items-center gap-space-md">
            <button type="button" onClick={() => handleSubmit(true)} className="px-space-lg py-space-sm rounded-xl bg-surface-container-lowest hover:bg-surface-container font-label-lg text-label-lg text-on-surface shadow-sm transition-colors whitespace-nowrap">{tx("Save Draft", "บันทึกร่าง")}</button>
            <button type="button" onClick={() => handleSubmit(false)} className="inline-flex items-center gap-space-sm bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg px-space-xl py-space-sm rounded-xl shadow-sm transition-all active:scale-95 whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{tx("Save & List Account", "บันทึกและวางขายไอดี")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

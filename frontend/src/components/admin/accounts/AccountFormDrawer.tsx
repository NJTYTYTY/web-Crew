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

export default function AccountFormDrawer({ open, editingAccount, onClose, onSave }: AccountFormDrawerProps) {
  const { tx } = useLanguage();
  const [platform, setPlatform] = useState<"roblox" | "rov">("roblox");
  const [title, setTitle] = useState("");
  const [priceThb, setPriceThb] = useState("2500");
  const [spec1, setSpec1] = useState("");
  const [spec2, setSpec2] = useState("");
  const [spec3, setSpec3] = useState("");
  const [serverRegion, setServerRegion] = useState("Global Server");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState<string[]>(["Godhuman Max", "Dough V2", "Unverified Email"]);
  const [tagInput, setTagInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [emailStatus, setEmailStatus] = useState("unverified");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (editingAccount) {
      setPlatform(editingAccount.platform);
      setTitle(editingAccount.title);
      setPriceThb(String(editingAccount.priceThb));
      setSpec1(editingAccount.spec1);
      setSpec2(editingAccount.spec2);
      setSpec3(editingAccount.spec3);
      setServerRegion(editingAccount.serverRegion || (editingAccount.platform === "rov" ? "TH / Garena Server" : "Global Server"));
      setDescription(editingAccount.description || "");
      setImageUrl(editingAccount.imageUrl || "");
      setTags(editingAccount.tags);
      setUsername(editingAccount.username);
      setPassword(editingAccount.password);
      setPin(editingAccount.pin === "None" ? "" : editingAccount.pin);
    } else {
      setPlatform("roblox"); setTitle(""); setPriceThb(""); setSpec1(""); setSpec2(""); setSpec3("");
      setServerRegion("Global Server"); setDescription(""); setImageUrl("");
      setTags(["Godhuman Max", "Dough V2", "Unverified Email"]); setUsername(""); setPassword(""); setPin("");
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
    const numPrice = Number(priceThb) || 1990;
    const defaultImg = INITIAL_GAME_ACCOUNTS[platform === "roblox" ? 0 : 1].imageUrl;
    onSave(
      {
        title: title.trim() || "Roblox Blox Fruits Max Lvl + Godhuman Vault",
        subtitle: emailStatus === "unverified" ? "Unverified Email • Instant Ownership" : "Auto-Transfer Ready • Just Added",
        subIcon: "vpn_key",
        platform,
        platformLabel: platform === "roblox" ? "Roblox" : "RoV (Garena)",
        spec1: spec1.trim() || (platform === "roblox" ? "Level 2550 (Max)" : "Supreme Conqueror"),
        spec2: spec2.trim() || tags.slice(0, 2).join(" • ") || "Verified Full Access",
        spec3: spec3.trim() || tags[2] || "Instant Escrow Delivery",
        serverRegion: serverRegion.trim() || (platform === "roblox" ? "Global Server" : "TH / Garena Server"),
        description: description.trim() || "Full access verified game account stored in ApexPay AES-256 escrow vault. Instant automated credential delivery after payment.",
        imageUrl: imageUrl.trim() || defaultImg,
        priceThb: numPrice,
        priceUsd: `~ $${(numPrice / 35).toFixed(2)} USD`,
        status: "available",
        username: username.trim() || "apex_vault_user99",
        password: password.trim() || "ApexSecret#2025",
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
              <span>{tx("Listing Wizard", "ตัวช่วยสร้างรายการไอดี")}</span>
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
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">{tx("Platform Category", "หมวดหมู่แพลตฟอร์มเกม")}</label>
            <div className="grid grid-cols-2 gap-space-md p-1 bg-surface-container-low rounded-xl">
              <button type="button" onClick={() => { setPlatform("roblox"); setServerRegion("Global Server"); }} className={`flex items-center justify-center gap-space-sm py-space-sm px-space-md rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${platform === "roblox" ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-medium"}`}>
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                <span>{tx("Roblox Platform", "แพลตฟอร์ม Roblox")}</span>
              </button>
              <button type="button" onClick={() => { setPlatform("rov"); setServerRegion("TH / Garena Server"); }} className={`flex items-center justify-center gap-space-sm py-space-sm px-space-md rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${platform === "rov" ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-medium"}`}>
                <span className="material-symbols-outlined text-[18px]">sports_esports</span>
                <span>RoV (Arena of Valor)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Listing Title *", "ชื่อรายการไอดี *")}</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Roblox Blox Fruits Max Lvl + Godhuman + Dough V2" type="text" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Price in THB (฿) *", "ราคาขาย (บาท ฿) *")}</label>
                <div className="relative flex items-center">
                  <span className="absolute left-space-md font-label-md text-label-md text-outline">฿</span>
                  <input value={priceThb} onChange={(e) => setPriceThb(e.target.value)} className={`w-full pl-8 pr-space-md ${inputCls}`} placeholder="2,500" type="number" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Tier / Level / Rank", "ระดับเลเวล / แรงค์")}</label>
                <input value={spec1} onChange={(e) => setSpec1(e.target.value)} className={inputCls} placeholder="e.g. Level 2550 or Conqueror" type="text" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Server / Region", "เซิร์ฟเวอร์ / ภูมิภาค")}</label>
                <input value={serverRegion} onChange={(e) => setServerRegion(e.target.value)} className={inputCls} placeholder="e.g. TH / Garena or Global" type="text" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Heroes / Fruits / Characters Summary", "สรุปฮีโร่ / ผลปีศาจ / ตัวละคร")}</label>
                <input value={spec2} onChange={(e) => setSpec2(e.target.value)} className={inputCls} placeholder={tx("e.g. 95 Heroes or Perm Kitsune + Godhuman", "เช่น 95 ฮีโร่ หรือ ผลคิตสึเนะถาวร + หมัดพระเจ้า")} type="text" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Skins / Rare Weapons Summary", "สรุปสกินแรร์ / อาวุธพิเศษ")}</label>
                <input value={spec3} onChange={(e) => setSpec3(e.target.value)} className={inputCls} placeholder={tx("e.g. 140 Skins or CDK + Soul Guitar", "เช่น 140 สกิน หรือ ดาบคู่ CDK + กีตาร์บรู๊ค")} type="text" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Detailed Account Description (Shown in Storefront Popup)", "รายละเอียดไอดีแบบเต็ม (แสดงในป๊อปอัปหน้าร้าน)")}</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="p-space-md bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all resize-y" placeholder={tx("Describe full inventory, rare skins, awakened fruits, arcana level, bind status, and warranty...", "ระบุรายละเอียดไอเทมในคลัง สกินแรร์ ผลปีศาจตื่น รูน สถานะการผูกเมล/เบอร์ และการรับประกัน...")} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{tx("Cover Image URL (Optional — uses default game cover if blank)", "ลิงก์รูปภาพปกไอดี (เว้นว่างเพื่อใช้รูปมาตรฐานได้)")}</label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputCls} placeholder="https://..." type="url" />
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
            <div className="flex items-start gap-space-md">
              <div className="w-9 h-9 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-tertiary">{tx("Automated Customer Vault Delivery", "ระบบจัดส่งรหัสผ่านอัตโนมัติ")}</span>
                  <span className="px-1.5 py-0.2 rounded font-label-sm text-[10px] bg-secondary text-on-secondary font-bold">AES-256</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                  {tx("Encrypted in ApexPay escrow vault and dispensed immediately upon IQ-Bank QR payment verification.", "เข้ารหัสในคลังนิรภัย ApexPay และส่งให้ลูกค้าทันทีเมื่อยืนยันการชำระเงินผ่าน IQ-Bank QR สำเร็จ")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">{tx("Game Username / Login ID *", "ชื่อผู้ใช้ / ไอดีเข้าเกม *")}</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} className={vaultInputCls} placeholder="e.g. apex_player_99" type="text" />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">{tx("Recovery PIN / 2FA Backup", "รหัส PIN กู้คืน / 2FA")}</label>
                <input value={pin} onChange={(e) => setPin(e.target.value)} className={vaultInputCls} placeholder="e.g. 6-digit PIN" type="text" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">{tx("Original Email Status", "สถานะอีเมลของไอดี")}</label>
                <select value={emailStatus} onChange={(e) => setEmailStatus(e.target.value)} className={vaultInputCls}>
                  <option value="unverified">{tx("Clean Unverified (Instant Bind)", "ไอดีสะอาดไม่ติดเมล (พร้อมผูกทันที)")}</option>
                  <option value="included">{tx("First Email Included (OGE Included)", "แถมอีเมลแรกให้พร้อมไอดี")}</option>
                  <option value="changeable">{tx("Email Changeable Instantly", "เปลี่ยนอีเมลได้ทันที")}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="px-space-xl py-space-lg bg-surface-container-low flex items-center justify-between shrink-0">
          <button type="button" onClick={onClose} className="px-space-lg py-space-sm rounded-xl font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container transition-colors whitespace-nowrap">{tx("Cancel", "ยกเลิก")}</button>
          <div className="flex items-center gap-space-md">
            <button type="button" onClick={() => handleSubmit(true)} className="px-space-lg py-space-sm rounded-xl bg-surface-container-lowest hover:bg-surface-container font-label-lg text-label-lg text-on-surface shadow-sm transition-colors whitespace-nowrap">{tx("Save as Draft", "บันทึกฉบับร่าง")}</button>
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

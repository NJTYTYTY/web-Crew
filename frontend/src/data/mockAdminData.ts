export const APEX_ADMIN_LOGO_URL =
  "https://lh3.googleusercontent.com/aida/AEtjO1XQkmaHs5f5F7m2A4e5llAtAuYyPHXMYN7SR5DWday6TJvrD9o5MQoWyRRHFCV47iT3LNZCSSW0yXPQaBowbhLw87JQ1bW4J783Eznq33rg7s52munazr7XZT3xythaPnsGC-rZ-J7xrFBBvmXMUU1-BtMNtddl7IyEAlwfgIlvknsMWmQ2NviauiFbS8e8YVeVDtretKV3jvkr3wwIreChYEdoJvoblnxX156horXtf-qdTRuLeEJMbw";

export interface OverviewTransaction {
  id: string;
  customerName: string;
  customerSub: string;
  gameBadge: "R" | "V" | "A" | "F";
  gameSku: string;
  amount: string;
  iqBankRef: string;
  status: "SUCCESS" | "WAITING OTP" | "FAILED (TIMEOUT)";
  timestamp: string;
  actionLabel: "Inspect" | "Resolve" | "Retry";
  gameName: string;
  skuCode: string;
  targetUid: string;
}

export const INITIAL_OVERVIEW_TRANSACTIONS: OverviewTransaction[] = [
  { id: "#ORD-99482", customerName: "Somchai K.", customerSub: "UID: 981249129", gameBadge: "R", gameSku: "Roblox 4,500 Robux Voucher", amount: "฿1,750.00", iqBankRef: "#TXN-IQ-98231", status: "SUCCESS", timestamp: "14:31:42", actionLabel: "Inspect", gameName: "Roblox", skuCode: "ROBUX-4500", targetUid: "981249129" },
  { id: "#ORD-99481", customerName: "Nattapong P.", customerSub: "Garena ID: nat_p99", gameBadge: "V", gameSku: "RoV 1,200 Coup + Skin Box", amount: "฿690.00", iqBankRef: "#TXN-IQ-98228", status: "WAITING OTP", timestamp: "14:30:11", actionLabel: "Resolve", gameName: "RoV", skuCode: "ROV-1200-SKIN", targetUid: "nat_p99" },
  { id: "#ORD-99480", customerName: "Arthit S.", customerSub: "ESCROW #ACC-783", gameBadge: "A", gameSku: "Valorant Radiant + Champion Karambit", amount: "฿12,500.00", iqBankRef: "#TXN-IQ-98215", status: "SUCCESS", timestamp: "14:28:55", actionLabel: "Inspect", gameName: "Valorant", skuCode: "ESCROW-ACC-783", targetUid: "ACC-783" },
  { id: "#ORD-99479", customerName: "Kanya T.", customerSub: "Player ID: 29482910", gameBadge: "F", gameSku: "Free Fire 2,180 + 218 Diamonds", amount: "฿499.00", iqBankRef: "#TXN-IQ-98204", status: "SUCCESS", timestamp: "14:26:19", actionLabel: "Inspect", gameName: "Free Fire", skuCode: "FF-2180-DIA", targetUid: "29482910" },
  { id: "#ORD-99478", customerName: "Chanon B.", customerSub: "Garena ID: boom_ch", gameBadge: "V", gameSku: "RoV 520 Vouchers Instant", amount: "฿150.00", iqBankRef: "#TXN-IQ-98199", status: "FAILED (TIMEOUT)", timestamp: "14:24:02", actionLabel: "Retry", gameName: "RoV", skuCode: "ROV-520-INST", targetUid: "boom_ch" },
];

export interface AdminGameAccount {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  subIcon: string;
  platform: "roblox" | "rov";
  platformLabel: string;
  spec1: string;
  spec2: string;
  spec3: string;
  description?: string;
  serverRegion?: string;
  priceThb: number;
  priceUsd: string;
  status: "available" | "sold";
  username: string;
  password: string;
  pin: string;
  imageUrl: string;
  tags: string[];
}

export const INITIAL_GAME_ACCOUNTS: AdminGameAccount[] = [
  {
    id: "acc-1", code: "#R-841", title: "Roblox Blox Fruits Max Lvl + Godhuman + Dough V2", subtitle: "Auto-Transfer Ready • Added 2h ago", subIcon: "vpn_key",
    platform: "roblox", platformLabel: "Roblox", spec1: "Level 2550 (Max)", spec2: "Godhuman • Dough V2 Awakened", spec3: "Cursed Dual Katana + Soul Guitar",
    serverRegion: "Global Server",
    description: "Max Level 2550 Blox Fruits account featuring full Godhuman mastery, Awakened Dough V2, Cursed Dual Katana (CDK), Soul Guitar, and 38M+ Beli. Clean unverified email ready for instant buyer binding with 100% escrow warranty.",
    priceThb: 3450, priceUsd: "~ $98.50 USD", status: "available", username: "rbx_bloxfan99", password: "K9!BloxV2$Secret", pin: "772910",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1ATLuwbDeTG3lfWq6qa4mZJl-a5SfbYliY8cO8-xXfRSrkRhHg1OB0fW0pBoYUwQszi-GAE9_t1M7R1pEqeECWveMRz1hkM4nrt253V1qUzTKu6HCjAE4rHh8YP1NJehptFcx-H1xG12T0211RGiQSJTyghMm9ysoZovZ4EKFkSjiwAoIYf-Xsree13hoNZC_oOmYz70kWbYAthEvh3RRHjJ9N-rxvmd21UcSK9j4d5pdqFMvuHWC",
    tags: ["Godhuman Max", "Dough V2", "Unverified Email"],
  },
  {
    id: "acc-2", code: "#ROV-412", title: "RoV Supreme Conqueror 120 Skins + Violet Dimension", subtitle: "Clean Garena ID • Clean Phone Bind", subIcon: "shield",
    platform: "rov", platformLabel: "RoV (Garena)", spec1: "Rank: Supreme Conqueror 68★", spec2: "120 Skins • Violet Dimension Breaker", spec3: "Winrate 64.2% • 108 Heroes All Maxed",
    serverRegion: "TH / Garena Server",
    description: "High-end Supreme Conqueror 68★ RoV account with 108 heroes and 120 rare skins including Violet Dimension Breaker, Nakroth Dimension Breaker, and full Lv.90 Arcana pages. Clean Garena ID with no phone bind.",
    priceThb: 4990, priceUsd: "~ $142.00 USD", status: "available", username: "gar_supconq99", password: "Violet$Omega98!", pin: "449102",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0xRe7LsbuNTJQnmUcZlvNlN1LOOqP95B5Y4-Mtxdc_O7m_IGZAcVYd1jK2AJH9EvKCJjJcUazqJwYKUyhpeI4Otk_E3OtJk_BvJLPAh0s-WO1redAP7X9gRWCQWvYAcv5d7OU8pumRGE8ouPGoAYJjSkwixD4vEx0fkA4Zf-bUl2eMJsTcEr7MUUdSEE3B1A2Rc_N8MhWIiuwBRAq2E2hmca4fj1dCvsn9RzRY6juNFOFsgRdiLHS",
    tags: ["Supreme Conqueror", "Violet Dimension", "Clean Bind"],
  },
  {
    id: "acc-3", code: "#R-720", title: "Roblox PS99 Huge Titanic Cat + 50M Diamonds", subtitle: "Unverified Email • Instant Ownership", subIcon: "bolt",
    platform: "roblox", platformLabel: "Roblox", spec1: "Titanic Pet + 8x Huge Pets", spec2: "52.4 Million Raw Gems In Bank", spec3: "VIP Pass & Auto-Hatch Unlocked",
    serverRegion: "Global Server",
    description: "Pet Simulator 99 collector account with 1x Titanic Pet, 8x Huge Pets, 52.4M pure Diamonds in bank, and all premium gamepasses (VIP, Auto-Hatch, Super Drops, Magic Eggs). Clean unverified email.",
    priceThb: 1890, priceUsd: "~ $54.00 USD", status: "available", username: "huge_collector", password: "TitanicCat#901", pin: "None",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbOlOqkL5V8yUiFDQCXl_26PNZFtOINiTmvoLNZRzr3Di92Yk5lLSviO9rkHGjgeuO0C9qBeSycTObzSWvWpCH4493IEtJTzYq5aIQetVz49n_AG06w59JjxC-raJsl8MONfHZxzYS4BfLXnViEvYFEBElxzyfspvbycfMUQUSliSD3VxdAjEF5GLGvJD5XAnF6pfzY7CBv_OQYco5W8RV5j9hW2xcmhvynh6sc4OW7VD1zBwYdfFV",
    tags: ["Titanic Pet", "50M Diamonds", "Unverified Email"],
  },
  {
    id: "acc-4", code: "#ROV-308", title: "RoV Master 30★ All Mage Arcana + Tulen Astral", subtitle: "Dispatched Order #TX-9021", subIcon: "lock_clock",
    platform: "rov", platformLabel: "RoV (Garena)", spec1: "Rank: Master 30★ (Season 28)", spec2: "74 Skins • 90 Heroes Unlocked", spec3: "Level 90 Arcana Pages (Magic/AP)",
    serverRegion: "TH / Garena Server",
    description: "Season 28 Master 30★ mid-lane specialist account with Tulen Astral Walker, Lauriel Divine Grace, 90 heroes, 74 skins, and full AP/Magic Pierce Lv.90 Arcana sets.",
    priceThb: 1250, priceUsd: "~ $35.70 USD", status: "sold", username: "gar_midlane88", password: "TulenMageWin#1", pin: "002931",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEhcEjGcxQpvwSrSk1hDjur2_89eZLxaHr2xA-SCnm5O6UfhvjjQeEAhDvrJtoJmI1-6vOi94t0utYK7Ok3wy2T1GbDFLVP35RoUKGP-lmugaZz1ds9mTUdNMxeez3EYf3hOA_mHvgItDayoUU6FKy4w1ev_nrEAL35XmhpP8_Glu9xd_j4C8WHP9o5hUSytWCNbxKmGIUDJjqLWv9-Gi7ic-KXgkNArmUsdfLVJBGVkHJxE-C5EBn",
    tags: ["Master 30★", "Tulen Astral", "Full Mage Arcana"],
  },
  {
    id: "acc-5", code: "#R-599", title: "Roblox Korblox Deathspeaker Leg + 2017 Old Join Date", subtitle: "Clean 4-Letter Inventory Account", subIcon: "verified_user",
    platform: "roblox", platformLabel: "Roblox", spec1: "Korblox Bundle Owned", spec2: "Join Year: 2017 • 12,000 Robux Spent", spec3: "Da Hood God Rank + Custom Guns",
    serverRegion: "Global Server",
    description: "Rare 2017 vintage Roblox account with complete Korblox Deathspeaker bundle, Stitchface, Da Hood God Rank with rare weapon skins, and clean OGE transfer guarantee.",
    priceThb: 5800, priceUsd: "~ $165.70 USD", status: "available", username: "korb_dhood99", password: "KorbloxKing2017!", pin: "902188",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt935ZllUNh-yYRyN362cgvCpJiaz95Zudt-i-9kZl1VnY1UagonvHi1pqNoAmfOfLtkobzMAwfmgJmuktzL8MreJzY4un1ZjYgsGOqTgoFxrrBjUNuIWvOTIpTEhJV4egeRU_vOhZmrV22OJft9NtPWX4K_zOf1hHPC76-R0JEJPKtLQyteKuD6adpjI9eYcjNo4scUdU0D2N4PRQ-6fhbkQfCZy7Sf7qMJCHaqwjJQY0Pm1wAbG8",
    tags: ["Korblox Leg", "2017 Vintage", "Da Hood God"],
  },
  {
    id: "acc-6", code: "#ROV-119", title: "RoV Starter Smurf Diamond I + Nakroth Cyber + 80% Winrate", subtitle: "High MMR • Clean Email", subIcon: "verified",
    platform: "rov", platformLabel: "RoV (Garena)", spec1: "Diamond I 5★ (Smurf MMR)", spec2: "24 Skins • Nakroth Cyber Blade", spec3: "Jungler Arcana Set Lvl 90",
    serverRegion: "TH / Garena Server",
    description: "High-MMR Diamond I 5★ smurf account with 80.4% ranked winrate, Nakroth AIC Cybercore Blade, Murad Celestial, and full Assassin/Jungler Lv.90 Arcana set.",
    priceThb: 850, priceUsd: "~ $24.20 USD", status: "available", username: "nak_smurf01", password: "Pass983#Jungle", pin: "None",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuChmYXomg9p-quXKDpGSmwdkNLFVhyJPGNLMfC6Jar0py4VWfJtcqitdAR2gKp8Mzqx_Jz0Dr52Wyr-_y0VMBXmA9eHKjjhScVybfWzu9kAqDqr23eIkIFDfcSYZFJ8q4mfGi7HyRwA-6a3PrQnTJgyP3H_X5grkEEr40awk_Juj1Swn3_Zt_nIQ94wJfpJGPhIJR2H7ZayscKcnRnApDJIw56frOEHbfKBRjxiQjDLktGBUj8Kg1ok",
    tags: ["Diamond Smurf", "Nakroth Cyber", "80% Winrate"],
  },
];

export interface AdminTopUpPackage {
  sku: string;
  name: string;
  subtitle: string;
  icon: string;
  iconStyle: "surface" | "primary" | "tertiary";
  tag: string;
  tagStyle: "standard" | "secondary" | "tertiary" | "primary";
  cost: number;
  price: number;
  denomination: string;
  game: "Roblox" | "RoV" | "FreeFire";
  active: boolean;
}

export const INITIAL_TOPUP_PACKAGES: AdminTopUpPackage[] = [
  { sku: "RBX-0800-STD", name: "800 Robux", subtitle: "SKU: RBX-0800-STD • In-Game Value: R$ 800", icon: "diamond", iconStyle: "surface", tag: "Standard", tagStyle: "standard", cost: 240, price: 290, denomination: "800", game: "Roblox", active: true },
  { sku: "RBX-1700-POP", name: "1,700 Robux", subtitle: "SKU: RBX-1700-POP • In-Game Value: R$ 1,700", icon: "stars", iconStyle: "primary", tag: "Hot Deal", tagStyle: "secondary", cost: 480, price: 590, denomination: "1700", game: "Roblox", active: true },
  { sku: "RBX-4500-VIP", name: "4,500 Robux + Bonus", subtitle: "SKU: RBX-4500-VIP • In-Game Value: R$ 4,500 + 400", icon: "military_tech", iconStyle: "tertiary", tag: "+400 Extra (20% OFF)", tagStyle: "tertiary", cost: 1180, price: 1490, denomination: "4500", game: "Roblox", active: true },
  { sku: "ROV-0350-BUN", name: "350 RoV Coupons", subtitle: "SKU: ROV-0350-BUN • In-Game Value: 350 Coupons", icon: "stars", iconStyle: "surface", tag: "+25 Bonus", tagStyle: "secondary", cost: 115, price: 149, denomination: "350", game: "RoV", active: true },
  { sku: "ROV-1200-MAX", name: "1,200 RoV Coupons", subtitle: "SKU: ROV-1200-MAX • In-Game Value: 1,200 Coupons", icon: "workspace_premium", iconStyle: "surface", tag: "Best Seller", tagStyle: "primary", cost: 395, price: 490, denomination: "1200", game: "RoV", active: true },
];

export interface AdminOrderItem {
  id: string;
  customerName: string;
  customerTier: string;
  avatarUrl?: string;
  avatarInitials?: string;
  avatarTone?: "surface" | "tertiary" | "secondary";
  type: "TOPUP" | "ACCOUNT";
  targetTitle: string;
  targetSubtitle: string;
  amount: number;
  iqRef: string;
  payment: "PAID" | "WAITING" | "FAILED";
  fulfillment: "Processing" | "Pending" | "Completed";
  searchMeta: string;
  targetUid: string;
  targetRegion: string;
  robloxUser: string;
  robloxPass: string;
  paymentChannel: string;
}

export const INITIAL_ADMIN_ORDERS: AdminOrderItem[] = [
  {
    id: "ORD-88291", customerName: "alex_garena", customerTier: "Tier 2 Regular",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiOFNe6nmDtdDPQ-kXHXX3IDUuvwXwUQ3Z1rIkEqsOC0R-KIbeILLxgdGJQVsALZXlWGGw4DJdIH_WIDv-Nkq393Nh0e7gqNpJyZEJe8QNy1-r_QLqVg0r4r_LA77H3RgVGBP5mV4NISkmN6aHgrBybDNAc2esZvj4KKOsI_6oCZ9m0WUvAR_LI5YoIaFGt_HHV1F3PoXtFUB3cEc28OwFYf0mIN-5ZULSw8mYN99OBpB2zfdfj50J",
    type: "TOPUP", targetTitle: "RoV UID: 2981048194", targetSubtitle: "520 Diamond + Voucher", amount: 850, iqRef: "IQ-TXN-902184",
    payment: "PAID", fulfillment: "Processing", searchMeta: "#ord-88291 alex_garena rov 2981048194 iq-txn-902184",
    targetUid: "2981048194", targetRegion: "Region: Thailand / Server: Arena 01", robloxUser: "alex_dragonx", robloxPass: "Gx99#Vortex!Secure", paymentChannel: "SCB_EASY_PAY",
  },
  {
    id: "ORD-88290", customerName: "user_dragonx", customerTier: "VIP Guild Member",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF8I94z5_lLA3ndc0jGZekpAaHKOGqiC6v9fd4Au_PKbI3Ab6_jxpJp6CtSd_3zugREMsa1vRobLs4rqRDOWtzEq_im--I9prw7-B5kZdI1WlnsFhavhvbWAYO7JlGUdZ428H6rzMu-dsk649jwg0bOyP89SATLT4AdxypcDppwKpFzy74G5y4XThJEhsxpm9cY0kSgJXGDYWzLA1CrHyaikS-TB_I6XWWXqjQmiqI38dtnBHI78RG",
    type: "TOPUP", targetTitle: "Roblox: user_dragonx", targetSubtitle: "1,200 Robux Fast Credit", amount: 420, iqRef: "IQ-TXN-902183",
    payment: "PAID", fulfillment: "Pending", searchMeta: "#ord-88290 roblox user_dragonx iq-txn-902183",
    targetUid: "992014821", targetRegion: "Region: Global / Bot Node 02", robloxUser: "user_dragonx", robloxPass: "DrgX#2025!Robux", paymentChannel: "KBANK_PROMPTPAY",
  },
  {
    id: "ORD-88289", customerName: "mythic_val", customerTier: "Verified Buyer",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6EI-pb0qbc9t9Xl4alS-ME1bcRacKPPPbFZn0-9Rr1HZZo-nKd702pB3PfS03pDFuXO6DboPoBsr9IiXrkDRky_gpXPTEOldCIzKsRLcgADYRJUaXmSAQLG7SWMRbo1rXo9rJQUJHeuP1r9inHKX7LRVr6UzFECVC3OrgbNGw37bMYDS8_nmecWMridXuwpA6QrO3FQKRptjTqiYLEPRLbrexzD2TjkBMO9nEx9L_loCujVl6IWZm",
    type: "ACCOUNT", targetTitle: "Valorant: Immortal 3 Bundle", targetSubtitle: "Kuronami + Reaver Vandal", amount: 3800, iqRef: "IQ-TXN-902180",
    payment: "PAID", fulfillment: "Completed", searchMeta: "#ord-88289 mythic_val valorant immortal iq-txn-902180",
    targetUid: "VAL-ESCROW-89", targetRegion: "Region: AP-Southeast (Singapore)", robloxUser: "mythic_val_oge", robloxPass: "ValImmortal#399!", paymentChannel: "SCB_EASY_PAY",
  },
  {
    id: "ORD-88288", customerName: "ff_sniper99", customerTier: "New User", avatarInitials: "FF", avatarTone: "surface",
    type: "TOPUP", targetTitle: "Free Fire UID: 81920491", targetSubtitle: "1,060 Diamonds", amount: 300, iqRef: "IQ-TXN-902179",
    payment: "FAILED", fulfillment: "Pending", searchMeta: "#ord-88288 free fire 81920491 iq-txn-902179 bank timeout",
    targetUid: "81920491", targetRegion: "Region: Thailand / Server Inject #4", robloxUser: "ff_sniper99", robloxPass: "N/A (Direct UID)", paymentChannel: "SCB_PROMPTPAY",
  },
  {
    id: "ORD-88287", customerName: "kazuha_main", customerTier: "Tier 1 Regular", avatarInitials: "GI", avatarTone: "tertiary",
    type: "TOPUP", targetTitle: "Genshin UID: 802194812 (Asia)", targetSubtitle: "Blessing of the Welkin Moon", amount: 179, iqRef: "IQ-TXN-902175",
    payment: "WAITING", fulfillment: "Pending", searchMeta: "#ord-88287 genshin impact 802194812 iq-txn-902175 qr promptpay",
    targetUid: "802194812", targetRegion: "Region: Asia Official", robloxUser: "kazuha_main", robloxPass: "N/A (Direct UID)", paymentChannel: "PROMPTPAY_QR",
  },
  {
    id: "ORD-88286", customerName: "apex_fan", customerTier: "Top Spender", avatarInitials: "AP", avatarTone: "secondary",
    type: "ACCOUNT", targetTitle: "Steam Account (CS2 Prime)", targetSubtitle: "Fresh Mail Transfer", amount: 620, iqRef: "IQ-TXN-902170",
    payment: "PAID", fulfillment: "Completed", searchMeta: "#ord-88286 apex_fan steam gift code iq-txn-902170",
    targetUid: "STEAM-CS2-772", targetRegion: "Region: Global Steam Guard Off", robloxUser: "cs2_prime_vault7", robloxPass: "Karambit#CS2Prime", paymentChannel: "BBL_MOBILE",
  },
];

export interface AdminBannerItem {
  id: string;
  order: number;
  title: string;
  caption: string;
  badgeText: string;
  badgeTone: "active" | "external";
  heroBadge?: string;
  targetUrl: string;
  isExternal?: boolean;
  scheduleLabel: string;
  scheduleIcon: string;
  clicks: string;
  ctr: string;
  active: boolean;
  imageUrl: string;
}

export const INITIAL_ADMIN_BANNERS: AdminBannerItem[] = [
  {
    id: "1", order: 1, title: "Roblox Blox Fruits Special Deal — Instant Robux & Godhuman IDs",
    caption: "Instant Robux delivery + verified Max Level Blox Fruits accounts with Godhuman & Kitsune.",
    badgeText: "Active", badgeTone: "active", heroBadge: "Hero Slide #1", targetUrl: "/topup",
    scheduleLabel: "Always Active", scheduleIcon: "calendar_today", clicks: "14,200", ctr: "8.4% CTR", active: true,
    imageUrl: "/pic-banner-slide/roblox.webp",
  },
  {
    id: "2", order: 2, title: "RoV Champion League 2025 Top-Up Bonus (+25% Extra Coupons)",
    caption: "Get up to 25% extra RoV Coupons and browse Conqueror & Supreme Rank accounts.",
    badgeText: "Active", badgeTone: "active", heroBadge: "Hero Slide #2", targetUrl: "/accounts",
    scheduleLabel: "Seasonal Campaign", scheduleIcon: "calendar_today", clicks: "7,820", ctr: "6.2% CTR", active: true,
    imageUrl: "/pic-banner-slide/rov.jpeg",
  },
  {
    id: "3", order: 3, title: "Free Fire Instant UID Diamonds — 5-Second Auto Delivery",
    caption: "Direct UID Free Fire Diamond top-up with zero password required and 0% PromptPay fee.",
    badgeText: "Active", badgeTone: "active", heroBadge: "Hero Slide #3", targetUrl: "/topup",
    scheduleLabel: "24/7 Automated", scheduleIcon: "update", clicks: "4,120", ctr: "4.8% CTR", active: true,
    imageUrl: "/pic-banner-slide/freefire.jpeg",
  },
  {
    id: "4", order: 4, title: "Verified Roblox & RoV Accounts — 100% Clean Handover",
    caption: "Hand-inspected gaming accounts with instant credential reveal after payment.",
    badgeText: "Active", badgeTone: "active", heroBadge: "Hero Slide #4", targetUrl: "/accounts",
    scheduleLabel: "Storefront Featured", scheduleIcon: "verified", clicks: "2,350", ctr: "3.1% CTR", active: true,
    imageUrl: "/pic-banner-slide/roblox.jpeg",
  },
];

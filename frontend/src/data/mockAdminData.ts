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
    id: "acc-1", code: "#R-6214", title: "Blox Fruits [Lv.2550 MAX + Human V4 T10 + CDK + Awakened Ice/Dark]", subtitle: "100% Clean ID (No Phone / Email)", subIcon: "vpn_key",
    platform: "roblox", platformLabel: "Roblox", spec1: "Lv. 2550 (MAX) • Human V4 T10", spec2: "Awakened Ice & Dark + Spirit, Buddha", spec3: "CDK, Spikey Trident + All 6 Melee",
    serverRegion: "Global / SEA Server",
    description: "Clean Blox Fruits Max Level 2550 account (ID 6214) with Human V4 Tier 10, all 6 fighting styles mastered (Godhuman, Dragon Talon, E-Claw, Sharkman, Death Step, Superhuman), Cursed Dual Katana (CDK), Spikey Trident, Awakened Ice & Dark fruits, Spirit & Buddha in inventory, $481,731 Beli, and ƒ141,389 Fragments.",
    priceThb: 450, priceUsd: "~ $13.00 USD", status: "available", username: "blox_id6214_v4", password: "HumanV4#6214", pin: "None",
    imageUrl: "/game-account_sale/roblox01.png",
    tags: ["Human V4 T10", "CDK + 6 Melee", "ƒ141,389 Frag", "Clean ID"],
  },
  {
    id: "acc-2", code: "#ROV-194", title: "RoV Ex-Supreme [108 Heroes + 194 Skins + Lauriel Mythical & Airi Ultimate]", subtitle: "Garena ID • 57.4% WR (5,623 Matches)", subIcon: "shield",
    platform: "rov", platformLabel: "RoV (Garena)", spec1: "Ex-Supreme Rank (5,623 Matches)", spec2: "108 Heroes • Credibility 98", spec3: "194 Skins (Lauriel Mythical, Airi Ultimate)",
    serverRegion: "TH / Garena Server",
    description: "Former Supreme rank RoV account with 108 Heroes and 194 Skins (5,623 matches played, 57.4% win rate, 98 credibility score). Includes Lauriel The Phoenix (Mythical), Airi Sakura Fubuki (Ultimate), Krixi Witch's Creed (Halloween), and Tel'Annas Petal of Dream (VIP).",
    priceThb: 2500, priceUsd: "~ $71.50 USD", status: "available", username: "rov_supreme_194", password: "Lauriel#2500", pin: "982104",
    imageUrl: "/game-account_sale/rov1.png",
    tags: ["108 Heroes", "194 Skins", "Ex-Supreme", "57.4% Winrate"],
  },
  {
    id: "acc-3", code: "#R-2800", title: "Blox Fruits [Lv.2800 + Cyborg V4 T10 + 7 Melee Sanguine + Kitsune & CDK]", subtitle: "100% Clean ID • $7.16M Beli", subIcon: "bolt",
    platform: "roblox", platformLabel: "Roblox", spec1: "Lv. 2800 (MAX) • Cyborg V4 T10", spec2: "Kitsune Equipped + Buddha, Phoenix", spec3: "7 Fighting Styles (Sanguine) + Hallow Scythe & CDK",
    serverRegion: "Global / SEA Server",
    description: "High-end Lv. 2800 Blox Fruits PvP account featuring Cyborg V4 Full Gear (T10), all 7 Fighting Styles unlocked including Sanguine Art & Godhuman, Kitsune equipped, Cursed Dual Katana (CDK), Hallow Scythe, $7,164,697 Beli, and ƒ35,307 Fragments.",
    priceThb: 590, priceUsd: "~ $16.90 USD", status: "available", username: "cyborg_v4_kitsune", password: "Sanguine#2800", pin: "None",
    imageUrl: "/game-account_sale/roblox02.png",
    tags: ["Cyborg V4 T10", "7 Melee + Kitsune", "Hallow Scythe + CDK", "Clean ID"],
  },
  {
    id: "acc-4", code: "#ROV-300", title: "RoV Ex-Supreme [127 Heroes + 300 Skins + 2 Mythical & 2 Esteem Skins]", subtitle: "Garena ID • 12,624 Matches (100 Credibility)", subIcon: "verified",
    platform: "rov", platformLabel: "RoV (Garena)", spec1: "Ex-Supreme Rank (12,624 Matches)", spec2: "127 Heroes • 100 Credibility", spec3: "300 Skins (2 Mythical, 2 Esteem, 2 Ultimate)",
    serverRegion: "TH / Garena Server",
    description: "Collector-tier Ex-Supreme RoV account with 127 Heroes and 300 Skins (12,624 matches, 52.3% win rate, 100 credibility). Features 2 Mythical skins (Lauriel The Phoenix, Tel'Annas F.E.E-X1 Silverwing), 2 Esteem skins (Liliana Mirage, Violet Golden Dragon), and 2 Ultimate skins.",
    priceThb: 3500, priceUsd: "~ $100.00 USD", status: "available", username: "rov_collector_300", password: "Silverwing#3500", pin: "350012",
    imageUrl: "/game-account_sale/rov2.png",
    tags: ["127 Heroes", "300 Skins", "2 Mythical + 2 Esteem", "Ex-Supreme"],
  },
  {
    id: "acc-5", code: "#R-1115", title: "Blox Fruits [Fruit Notifier 2700R$ + 2x Mastery + 2x Money Gamepasses]", subtitle: "Clean Roblox ID • Permanent Gamepasses", subIcon: "verified_user",
    platform: "roblox", platformLabel: "Roblox", spec1: "Lv. 1115 (Gamepass Collector)", spec2: "Fruit Notifier (2,700 R$) + Rumble", spec3: "2x Mastery + 2x Money + Saber (Mas. 438)",
    serverRegion: "Global / SEA Server",
    description: "Rare Gamepass-loaded Blox Fruits account (Lv. 1115) owning Permanent Fruit Notifier (worth 2,700 Robux), 2x Mastery (450 Robux), and 2x Money (450 Robux). Equipped with Rumble fruit, Saber sword (Mastery 438), and $463,749 Beli.",
    priceThb: 650, priceUsd: "~ $18.60 USD", status: "available", username: "neheel23456", password: "Notifier#2700", pin: "None",
    imageUrl: "/game-account_sale/roblox03.png",
    tags: ["Fruit Notifier", "2x Mastery", "2x Money", "Rumble + Saber"],
  },
  {
    id: "acc-6", code: "#ROV-281", title: "RoV Collector [125 Heroes + 281 Skins + Airi & Nakroth Miracle Skins]", subtitle: "Garena ID • 2 Miracle Skins + Inosuke", subIcon: "verified",
    platform: "rov", platformLabel: "RoV (Garena)", spec1: "High Rank (5,334 Matches • 52.9% WR)", spec2: "125 Heroes • Credibility 96", spec3: "281 Skins (Airi & Nakroth Miracle, Inosuke)",
    serverRegion: "TH / Garena Server",
    description: "Stacked RoV collector account with 125 Heroes and 281 Skins (5,334 matches, 52.9% win rate, 96 credibility). Includes 2 Miracle skins (Airi Sakura Fubuki, Nakroth Mechanized Zero), Airi Gold Edition (Esteem), Tel'Annas Realm Guardian (Ultimate), and Demon Slayer Inosuke Zephys.",
    priceThb: 2800, priceUsd: "~ $80.00 USD", status: "available", username: "rov_miracle_281", password: "Mechanized#2800", pin: "281990",
    imageUrl: "/game-account_sale/rov3.png",
    tags: ["125 Heroes", "281 Skins", "2 Miracle Skins", "Inosuke Collab"],
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

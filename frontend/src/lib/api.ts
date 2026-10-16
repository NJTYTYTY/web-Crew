import { AccountProduct, BannerItem, CustomerOrder, PackagesByGame, TopupGameKey, TopupGamesMetaByKey, UserProfile } from '@/types/store';
import { initialAccountProducts, initialBanners, initialPackagesData, initialTopupGamesMeta } from '@/data/mockStoreData';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const TOKEN_KEY = 'nexus_play_token';
const USER_KEY = 'nexus_play_user';
const ADMIN_TOKEN_KEY = 'nexus_play_admin_token';
const ADMIN_USER_KEY = 'nexus_play_admin_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.username === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(USER_KEY);
  } catch {}
}

export function getAdminSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.role === 'ADMIN' && typeof parsed.username === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function setAdminSession(user: UserProfile, token?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({ ...user, role: 'ADMIN' }));
    if (token) window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {}
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ADMIN_USER_KEY);
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {}
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isAdminCall = path.startsWith('/api/admin') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));
  const adminToken = typeof window !== 'undefined' ? window.localStorage.getItem(ADMIN_TOKEN_KEY) : null;
  const token = (isAdminCall && adminToken) ? adminToken : getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || errBody.message || `API Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const fetchBannersApi = () => apiRequest<any>('/api/banners');
export const fetchAccountsApi = () => apiRequest<any>('/api/accounts');
export const fetchTopupGamesApi = () => apiRequest<any>('/api/topup/games');
export const fetchMeApi = () => apiRequest<any>('/api/auth/me');
export const fetchOrdersApi = () => apiRequest<any>('/api/orders');
export const fetchOrderStatusApi = (orderId: number | string) => apiRequest<any>(`/api/orders/${orderId}/status`);

export const loginApi = (username: string, password: string) =>
  apiRequest<any>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });

export const registerApi = (username: string, password: string, confirmPassword: string) =>
  apiRequest<any>('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, password, confirmPassword }) });

export const logoutApi = () => apiRequest<any>('/api/auth/logout', { method: 'POST' });

export interface CreateOrderRequestPayload {
  orderType: 'ACCOUNT' | 'TOPUP';
  gameAccountId?: number;
  topupPackageId?: number;
  targetMetadata?: { playerUid?: string; robloxUsername?: string; robloxPassword?: string };
}

export const createOrderApi = (payload: CreateOrderRequestPayload) =>
  apiRequest<any>('/api/orders', { method: 'POST', body: JSON.stringify(payload) });

export async function triggerIqBankSimulatorApi(payload: {
  transactionRef: string;
  status: 'SUCCESS' | 'FAILED';
  amount: number;
}) {
  try {
    return await apiRequest<any>('/api/webhooks/iqbank/simulate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    return await apiRequest<any>('/api/webhooks/iqbank', {
      method: 'POST',
      headers: { 'x-iqbank-signature': 'demo-simulator-bypass' },
      body: JSON.stringify({
        event: payload.status === 'SUCCESS' ? 'payment.succeeded' : 'payment.failed',
        transactionRef: payload.transactionRef,
        amount: payload.amount,
        status: payload.status,
        timestamp: new Date().toISOString(),
      }),
    });
  }
}

export function normalizeBanners(res: any): BannerItem[] | null {
  const list = Array.isArray(res) ? res : res?.banners;
  return Array.isArray(list) ? list : null;
}

export function normalizeAccounts(res: any): AccountProduct[] | null {
  const list = Array.isArray(res) ? res : res?.accounts;
  if (!Array.isArray(list)) return null;
  return list.map((a: any, idx: number) => {
    const isRov = a.gameCategory === 'ROV' || a.game === 'RoV';
    const specs = a.specs || {};
    return {
      id: `acc-${a.id ?? idx + 1}`,
      dbId: a.id,
      game: isRov ? 'RoV' : 'Roblox',
      title: a.title || 'Game Account',
      description: a.description ?? '',
      levelOrRank: specs.levelOrRank || a.levelOrRank || (isRov ? 'Conqueror / Master Rank' : 'Max Level 2550'),
      serverRegion: specs.serverRegion || a.serverRegion || (isRov ? 'Garena Thailand (TH)' : 'Global / SEA'),
      emailStatus: specs.emailStatus || a.emailStatus || '100% Clean Unlinked',
      heroesOrFruitsCount: specs.heroesOrFruitsCount || a.heroesOrFruitsCount || undefined,
      skinsOrWeaponsCount: specs.skinsOrWeaponsCount || a.skinsOrWeaponsCount || undefined,
      price: Number(a.price),
      tags: Array.isArray(a.highlightTags) ? a.highlightTags : Array.isArray(a.tags) ? a.tags : [],
      stock: a.status === 'SOLD' || a.stock === 'sold_out' ? 'sold_out' : 'in_stock',
      image: a.imageUrl || a.image || (isRov ? '/game-logos/rov/rov-banner.png' : '/game-logos/roblox/blox-fruits.png'),
      revealedUser: a.accountUsername || '',
      revealedPass: a.accountPassword || '',
    };
  });
}

export function normalizeTopupGames(res: any): PackagesByGame | null {
  const list = Array.isArray(res) ? res : res?.games;
  if (!Array.isArray(list)) return null;
  const mapped: PackagesByGame = { ...initialPackagesData };
  list.forEach((g: any) => {
    const slug = (g.slug || '').toLowerCase() as TopupGameKey;
    if ((slug === 'rov' || slug === 'freefire' || slug === 'roblox') && Array.isArray(g.packages)) {
      mapped[slug] = g.packages.map((p: any, i: number) => ({
        id: `${slug}-${p.id ?? i + 1}`,
        dbId: p.id,
        label: p.packageName || p.label,
        bonus: p.bonusTag ?? p.bonus ?? '',
        price: Number(p.price),
        hot: Boolean(p.isPopular ?? (i === 1 || i === 2)),
      }));
    }
  });
  return mapped;
}

export function normalizeTopupGamesMeta(res: any): TopupGamesMetaByKey | null {
  const list = Array.isArray(res) ? res : res?.games;
  if (!Array.isArray(list) || list.length === 0) return null;
  const mapped: TopupGamesMetaByKey = { ...initialTopupGamesMeta };
  list.forEach((g: any) => {
    const slug = (g.slug || '').toLowerCase() as TopupGameKey;
    if (slug === 'rov' || slug === 'freefire' || slug === 'roblox') {
      mapped[slug] = {
        slug,
        name: g.name || initialTopupGamesMeta[slug].name,
        iconUrl: g.iconUrl || initialTopupGamesMeta[slug].iconUrl,
        inputMode: g.inputMode === 'ID_PASS' ? 'ID_PASS' : 'UID',
        isActive: g.isActive !== false,
      };
    }
  });
  return mapped;
}

export function mapDbTxnToOverview(row: any) {
  const isAccount = row.orderType === 'ACCOUNT';
  const gName = row.gameName || (isAccount ? 'Roblox' : 'RoV');
  const badge: 'R' | 'V' | 'A' | 'F' = gName.toLowerCase().includes('rov') ? 'V' : gName.toLowerCase().includes('free') ? 'F' : isAccount ? 'A' : 'R';
  const status: 'SUCCESS' | 'WAITING OTP' | 'FAILED (TIMEOUT)' =
    row.status === 'PAID' ? 'SUCCESS' : row.status === 'CANCELLED' || row.paymentStatus === 'FAILED' ? 'FAILED (TIMEOUT)' : 'WAITING OTP';
  const actionLabel: 'Inspect' | 'Resolve' | 'Retry' = status === 'SUCCESS' ? 'Inspect' : status === 'WAITING OTP' ? 'Resolve' : 'Retry';
  const targetUid = row.targetMetadata?.playerUid || row.targetMetadata?.robloxUsername || (row.gameAccountId ? `ACC-${row.gameAccountId}` : 'DIRECT');
  const subLabel = isAccount ? `ACCOUNT #ACC-${row.gameAccountId || 1}` : row.targetMetadata?.playerUid ? `UID: ${row.targetMetadata.playerUid}` : `User: ${row.targetMetadata?.robloxUsername || row.username}`;
  const timeStr = row.createdAt ? new Date(row.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now';
  return {
    id: `#${row.orderNumber || `ORD-${row.id}`}`,
    customerName: row.username || 'customer',
    customerSub: subLabel,
    gameBadge: badge,
    gameSku: row.itemTitle || 'Order Item',
    amount: `฿${Number(row.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    iqBankRef: `#${row.transactionRef || 'IQB-TX'}`,
    status,
    timestamp: timeStr,
    actionLabel,
    gameName: gName,
    skuCode: isAccount ? `ACC-${row.gameAccountId || 1}` : `PKG-${row.topupPackageId || 1}`,
    targetUid: String(targetUid),
  };
}

export function mapDbOrderToAdminItem(row: any, idx: number) {
  const isTopup = row.orderType === 'TOPUP';
  const payStatus: 'PAID' | 'WAITING' | 'FAILED' =
    row.status === 'PAID' || row.payment?.status === 'SUCCESS' ? 'PAID' : row.status === 'CANCELLED' || row.payment?.status === 'FAILED' ? 'FAILED' : 'WAITING';
  const fulfillStatus: 'Completed' | 'Processing' | 'Pending' =
    row.fulfillmentStatus === 'COMPLETED' ? 'Completed' : row.fulfillmentStatus === 'PROCESSING' ? 'Processing' : 'Pending';
  const uidOrUser = row.targetMetadata?.playerUid || row.targetMetadata?.robloxUsername || row.accountUsername || `ACC-${row.gameAccountId || idx + 1}`;
  const targetTitle = isTopup
    ? row.targetMetadata?.playerUid ? `${row.gameName || 'Game'} UID: ${row.targetMetadata.playerUid}` : `Roblox: ${row.targetMetadata?.robloxUsername || row.username}`
    : row.itemTitle || 'Game Account';
  const targetSubtitle = isTopup ? row.itemTitle || 'Top-Up Package' : `Account ID: ${row.accountUsername || 'Verified'}`;
  const iqRef = row.payment?.transactionRef || `IQB-TX-${100000 + Number(row.id || idx)}`;
  const orderId = row.orderNumber || `ORD-${row.id}`;
  const tones: Array<'surface' | 'tertiary' | 'secondary'> = ['secondary', 'tertiary', 'surface'];
  return {
    id: orderId,
    customerName: row.username || 'customer',
    customerTier: row.status === 'PAID' ? 'Verified Buyer' : 'Customer',
    avatarInitials: String(row.username || 'CU').slice(0, 2).toUpperCase(),
    avatarTone: tones[idx % tones.length],
    type: (isTopup ? 'TOPUP' : 'ACCOUNT') as 'TOPUP' | 'ACCOUNT',
    targetTitle,
    targetSubtitle,
    amount: Number(row.totalAmount || 0),
    iqRef,
    payment: payStatus,
    fulfillment: fulfillStatus,
    searchMeta: `${orderId} ${row.username || ''} ${targetTitle} ${targetSubtitle} ${iqRef}`.toLowerCase(),
    targetUid: String(uidOrUser),
    targetRegion: isTopup ? 'Region: Thailand / Direct Server' : 'Region: Global / Clean Handover',
    robloxUser: row.targetMetadata?.robloxUsername || row.accountUsername || row.username || 'N/A',
    robloxPass: row.targetMetadata?.robloxPassword || row.accountPassword || 'N/A (Direct UID)',
    paymentChannel: 'IQ_BANK_PROMPTPAY_QR',
  };
}


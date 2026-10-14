import { AccountProduct, BannerItem, PackagesByGame, TopupGameKey, TopupGamesMetaByKey } from '@/types/store';
import { initialAccountProducts, initialBanners, initialPackagesData, initialTopupGamesMeta } from '@/data/mockStoreData';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const TOKEN_KEY = 'nexus_play_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
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
  return Array.isArray(list) && list.length > 0 ? list : null;
}

export function normalizeAccounts(res: any): AccountProduct[] | null {
  const list = Array.isArray(res) ? res : res?.accounts;
  if (!Array.isArray(list) || list.length === 0) return null;
  return list.map((a: any, idx: number) => {
    const fallback = initialAccountProducts[idx % initialAccountProducts.length];
    const isRov = a.gameCategory === 'ROV' || a.game === 'RoV';
    const specs = a.specs || {};
    return {
      id: `acc-${a.id ?? idx + 1}`,
      dbId: a.id,
      game: isRov ? 'RoV' : 'Roblox',
      title: a.title || fallback.title,
      description: a.description || fallback.description,
      levelOrRank: specs.levelOrRank || a.levelOrRank || fallback.levelOrRank || (isRov ? 'Conqueror / Master Rank' : 'Max Level 2550'),
      serverRegion: specs.serverRegion || a.serverRegion || fallback.serverRegion || (isRov ? 'Garena Thailand (TH)' : 'Global / SEA'),
      emailStatus: specs.emailStatus || a.emailStatus || fallback.emailStatus || '100% Clean Unlinked',
      heroesOrFruitsCount: specs.heroesOrFruitsCount || a.heroesOrFruitsCount || fallback.heroesOrFruitsCount,
      skinsOrWeaponsCount: specs.skinsOrWeaponsCount || a.skinsOrWeaponsCount || fallback.skinsOrWeaponsCount,
      price: Number(a.price),
      tags: Array.isArray(a.highlightTags) ? a.highlightTags : a.tags || fallback.tags,
      stock: a.status === 'SOLD' || a.stock === 'sold_out' ? 'sold_out' : 'in_stock',
      image: a.imageUrl || a.image || fallback.image,
      revealedUser: a.accountUsername || fallback.revealedUser,
      revealedPass: a.accountPassword || fallback.revealedPass,
    };
  });
}

export function normalizeTopupGames(res: any): PackagesByGame | null {
  const list = Array.isArray(res) ? res : res?.games;
  if (!Array.isArray(list) || list.length === 0) return null;
  const mapped: PackagesByGame = { ...initialPackagesData };
  list.forEach((g: any) => {
    const slug = (g.slug || '').toLowerCase() as TopupGameKey;
    if ((slug === 'rov' || slug === 'freefire' || slug === 'roblox') && Array.isArray(g.packages) && g.packages.length > 0) {
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

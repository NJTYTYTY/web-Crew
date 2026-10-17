'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AccountProduct, ActiveOrder, AuthMode, BannerItem, CustomerOrder,
  ModalStateName, PackagesByGame, StoreContextValue, StoreViewName, TopupGameKey, TopupGamesMetaByKey, TopupPackage, UserProfile,
} from '@/types/store';
import {
  defaultActiveOrder, initialAccountProducts, initialBanners, initialCustomerOrders, initialPackagesData, initialTopupGamesMeta,
} from '@/data/mockStoreData';
import {
  createOrderApi, fetchAccountsApi, fetchBannersApi, fetchMeApi, fetchOrdersApi,
  fetchTopupGamesApi, getStoredUser, loginApi, logoutApi, normalizeAccounts,
  normalizeBanners, normalizeTopupGames, normalizeTopupGamesMeta, registerApi, setStoredToken, setStoredUser, triggerIqBankSimulatorApi,
} from '@/lib/api';
import { useStoreOrderSync } from './useStoreOrderSync';

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const VIEW_TO_ROUTE: Record<StoreViewName, string> = {
  home: '/', accounts: '/accounts', topup: '/topup',
  orders: '/orders', auth: '/login', simulator: '/iq-bank-simulator',
};

type PendingPurchase = { type: 'account'; accId: string } | { type: 'topup' } | null;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentView, setCurrentView] = useState<StoreViewName>('home');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [banners, setBanners] = useState<BannerItem[]>(initialBanners);
  const [accountProducts, setAccountProducts] = useState<AccountProduct[]>(initialAccountProducts);
  const [packagesData, setPackagesData] = useState<PackagesByGame>(initialPackagesData);
  const [topupGamesMeta, setTopupGamesMeta] = useState<TopupGamesMetaByKey>(initialTopupGamesMeta);
  const [activeTopupGame, setActiveTopupGame] = useState<TopupGameKey>('rov');
  const [selectedPackage, setSelectedPackage] = useState<TopupPackage>(initialPackagesData.rov[2]);
  const [uidInput, setUidInput] = useState('9842109841');
  const [robloxUser, setRobloxUser] = useState('BloxMaster_TH');
  const [robloxPass, setRobloxPass] = useState('SafePassword123');
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalStateName>('waiting');
  const [activeOrder, setActiveOrder] = useState<ActiveOrder>(defaultActiveOrder);
  const [selectedAccountForDetail, setSelectedAccountForDetail] = useState<AccountProduct | null>(null);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<PendingPurchase>(null);
  const [simLogs, setSimLogs] = useState<string[]>([
    '[READY] IQ-Bank Sandbox listening on port 4000...',
    `[INFO] Standby for payment dispatch. Active Ref: ${defaultActiveOrder.txRef}`,
  ]);

  const refreshStoreCatalog = useCallback(() => {
    fetchBannersApi().then((r) => { const b = normalizeBanners(r); if (b) setBanners(b); }).catch(() => {});
    fetchAccountsApi().then((r) => { const a = normalizeAccounts(r); if (a) setAccountProducts(a); }).catch(() => {});
    fetchTopupGamesApi().then((r) => {
      const m = normalizeTopupGames(r); const meta = normalizeTopupGamesMeta(r);
      if (meta) {
        setTopupGamesMeta(meta);
        setActiveTopupGame((prev) => {
          if (prev && meta[prev] && meta[prev].isActive) return prev;
          const activeKeys = Object.keys(meta).filter((k) => meta[k].isActive);
          return activeKeys[0] || 'rov';
        });
      }
      if (m) {
        setPackagesData(m);
        setSelectedPackage((prev) => {
          const allPkgs = Object.values(m).flat();
          return allPkgs.find((p) => p.id === prev?.id) || (m[activeTopupGame] && m[activeTopupGame][0]) || allPkgs[0] || null;
        });
      }
    }).catch(() => {});
    fetchOrdersApi().then((r) => { if (Array.isArray(r?.orders)) setCustomerOrders(r.orders); }).catch(() => {});
  }, [activeTopupGame]);

  useEffect(() => {
    if (!pathname) return;
    if (pathname === '/') setCurrentView('home');
    else if (pathname.startsWith('/accounts')) setCurrentView('accounts');
    else if (pathname.startsWith('/topup')) setCurrentView('topup');
    else if (pathname.startsWith('/orders')) setCurrentView('orders');
    else if (pathname.startsWith('/login')) { setCurrentView('auth'); setAuthMode('login'); }
    else if (pathname.startsWith('/register')) { setCurrentView('auth'); setAuthMode('register'); }
    else if (pathname.startsWith('/iq-bank-simulator')) setCurrentView('simulator');
    if (!pathname.startsWith('/admin')) refreshStoreCatalog();
  }, [pathname, refreshStoreCatalog]);

  useEffect(() => {
    const cached = getStoredUser(); if (cached) setUser(cached);
    refreshStoreCatalog();
    fetchMeApi().then((r) => {
      const u = r?.user || r;
      if (u?.username) { const nextUser: UserProfile = { id: u.id, username: u.username, role: u.role || 'CUSTOMER' }; setUser(nextUser); setStoredUser(nextUser); }
    }).catch(() => {});
    try { const s = localStorage.getItem('nexusplay_active_order'); if (s) { const p = JSON.parse(s); if (p?.txRef) setActiveOrder(p); } } catch {}
    const onFocus = () => refreshStoreCatalog();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshStoreCatalog]);

  useStoreOrderSync({
    isModalOpen,
    modalState,
    activeOrder,
    setActiveOrder,
    setModalState,
    setIsModalOpen,
    refreshStoreCatalog,
  });

  const syncActiveOrder = (nextOrder: ActiveOrder) => {
    setActiveOrder(nextOrder);
    try {
      localStorage.setItem('nexusplay_active_order', JSON.stringify(nextOrder));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('nexusplay_payment_channel');
        bc.postMessage({ type: 'ACTIVE_ORDER', order: nextOrder });
        bc.close();
      }
    } catch {}
  };

  const switchView = (view: StoreViewName, modeOverride?: AuthMode) => {
    setCurrentView(view);
    if (view === 'auth') {
      const mode = modeOverride || authMode;
      setAuthMode(mode);
      router.push(mode === 'register' ? '/register' : '/login');
    } else router.push(VIEW_TO_ROUTE[view]);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectTopupGame = (gameKey: TopupGameKey) => {
    setActiveTopupGame(gameKey);
    const pkgs = packagesData[gameKey] || initialPackagesData[gameKey] || [];
    setSelectedPackage(pkgs[2] || pkgs[0] || null);
  };

  const selectPackage = (pkgId: string) => {
    const found = (packagesData[activeTopupGame] || []).find((p) => p.id === pkgId);
    if (found) setSelectedPackage(found);
  };

  const openModal = (state: ModalStateName = 'waiting') => { setModalState(state); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);
  const openSimulatorDirectly = () => {
    try { localStorage.setItem('nexusplay_active_order', JSON.stringify(activeOrder)); } catch {}
    if (typeof window !== 'undefined') window.open('/iq-bank-simulator', '_blank');
  };
  const openAccountDetail = (acc: AccountProduct) => setSelectedAccountForDetail(acc);
  const closeAccountDetail = () => setSelectedAccountForDetail(null);
  const closeAuthPrompt = () => { setIsAuthPromptOpen(false); setPendingPurchase(null); };

  const executeBuyAccount = async (accId: string) => {
    const acc = accountProducts.find((a) => a.id === accId);
    if (!acc || acc.stock !== 'in_stock') return;
    setSelectedAccountForDetail(null);
    let id = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    let txRef = 'IQB-TX-' + Math.floor(100000 + Math.random() * 900000);
    let dbId: number | undefined;
    let qrPayload: string | undefined;
    try {
      const res = await createOrderApi({ orderType: 'ACCOUNT', gameAccountId: acc.dbId || Number(acc.id) });
      id = res?.order?.orderNumber || id;
      dbId = res?.order?.id;
      txRef = res?.payment?.transactionRef || txRef;
      qrPayload = res?.payment?.qrPayload;
    } catch (err: any) {
      alert(err.message || 'Failed to checkout account');
      return;
    }
    syncActiveOrder({ id, dbId, txRef, title: acc.title, type: 'account', price: acc.price, username: '', password: '', date: 'Just now', qrPayload });
    setSimLogs((prev) => [...prev, `[INFO] New pending order created. Active Ref: ${txRef} (฿${acc.price})`]);
    openModal('waiting');
  };

  const executeTopupCheckout = async () => {
    if (!selectedPackage || !selectedPackage.dbId) return;
    const activeMeta = topupGamesMeta[activeTopupGame];
    const isIdPass = (activeMeta?.inputMode || (activeTopupGame === 'roblox' ? 'ID_PASS' : 'UID')) === 'ID_PASS';
    const gameLabel = activeMeta?.name || 'Game Top-Up';
    const price = selectedPackage.price;
    let id = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    let txRef = 'IQB-TX-' + Math.floor(100000 + Math.random() * 900000);
    let dbId: number | undefined;
    let qrPayload: string | undefined;
    try {
      const res = await createOrderApi({
        orderType: 'TOPUP',
        topupPackageId: selectedPackage.dbId,
        targetMetadata: isIdPass
          ? { username: robloxUser, password: robloxPass, robloxUsername: robloxUser, robloxPassword: robloxPass }
          : { playerUid: uidInput },
      });
      id = res?.order?.orderNumber || id;
      dbId = res?.order?.id;
      txRef = res?.payment?.transactionRef || txRef;
      qrPayload = res?.payment?.qrPayload;
    } catch (err: any) {
      alert(err.message || 'Failed to checkout top-up');
      return;
    }
    syncActiveOrder({ id, dbId, txRef, title: `${gameLabel} - ${selectedPackage?.label || 'Package'}`, type: 'topup', price, username: isIdPass ? robloxUser : `UID: ${uidInput}`, date: 'Just now', qrPayload });
    setSimLogs((prev) => [...prev, `[INFO] Standby for Top-Up payment dispatch. Active Ref: ${txRef}`]);
    openModal('waiting');
  };

  const buyAccount = async (accId: string) => {
    const acc = accountProducts.find((a) => a.id === accId);
    if (!acc || acc.stock !== 'in_stock') return;
    if (!user) { setSelectedAccountForDetail(null); setPendingPurchase({ type: 'account', accId }); setIsAuthPromptOpen(true); return; }
    await executeBuyAccount(accId);
  };

  const handleTopupCheckout = async () => {
    if (!user) { setPendingPurchase({ type: 'topup' }); setIsAuthPromptOpen(true); return; }
    await executeTopupCheckout();
  };

  const finishAuthAndResume = async (nextPurchase: PendingPurchase) => {
    setIsAuthPromptOpen(false); setPendingPurchase(null);
    if (nextPurchase?.type === 'account') await executeBuyAccount(nextPurchase.accId);
    else if (nextPurchase?.type === 'topup') await executeTopupCheckout();
    else if (currentView === 'auth') switchView('home');
  };

  const applyAuthSession = async (res: any, fallbackUsername: string) => {
    if (res?.token) setStoredToken(res.token);
    const nextUser: UserProfile = { id: res?.user?.id, username: res?.user?.username || fallbackUsername, role: res?.user?.role || 'CUSTOMER' };
    setUser(nextUser); setStoredUser(nextUser);
    const ordRes = await fetchOrdersApi().catch(() => null);
    if (Array.isArray(ordRes?.orders)) setCustomerOrders(ordRes.orders);
  };

  const login = async (username: string, password: string) => {
    const res = await loginApi(username, password);
    await applyAuthSession(res, username);
    await finishAuthAndResume(pendingPurchase);
  };

  const register = async (username: string, password: string, confirmPassword: string) => {
    const res = await registerApi(username, password, confirmPassword);
    await applyAuthSession(res, username);
    await finishAuthAndResume(pendingPurchase);
  };

  const logout = async () => { await logoutApi().catch(() => {}); setStoredToken(null); setStoredUser(null); setUser(null); setCustomerOrders([]); };

  const simulateQRUpload = () => {
    setSimLogs((prev) => [...prev, '[QR SCANNER] Detected EMVCo PromptPay QR Code!', `[PAYLOAD] Merch: NEXUS PLAY | Ref: ${activeOrder.txRef} | Amt: ฿${activeOrder.price}`]);
  };

  const triggerWebhookSuccess = async () => {
    try {
      await triggerIqBankSimulatorApi({ transactionRef: activeOrder.txRef, status: 'SUCCESS', amount: activeOrder.price });
      setSimLogs((prev) => [...prev, '[WEBHOOK DISPATCH] POST /api/webhooks/iqbank HTTP/1.1 (200 OK)', `[IQ-BANK SUCCESS] Payment verified for ${activeOrder.txRef}. Amount: ฿${activeOrder.price} — Storefront tab updated!`]);
      refreshStoreCatalog();
      try {
        localStorage.setItem('nexusplay_payment_event', JSON.stringify({ status: 'SUCCESS', txRef: activeOrder.txRef, order: activeOrder, ts: Date.now() }));
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('nexusplay_payment_channel');
          bc.postMessage({ type: 'PAYMENT_SUCCESS', order: activeOrder }); bc.close();
        }
      } catch {}
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/iq-bank-simulator')) openModal('success');
    } catch (err: any) {
      setSimLogs((prev) => [...prev, `[WEBHOOK DISPATCH ERROR] Failed to trigger payment: ${err.message || 'Error'}`]);
      throw err;
    }
  };

  const triggerWebhookFailed = async () => {
    try {
      await triggerIqBankSimulatorApi({ transactionRef: activeOrder.txRef, status: 'FAILED', amount: activeOrder.price });
      setSimLogs((prev) => [...prev, '[WEBHOOK DISPATCH] Transaction canceled or expired by user bank app.']);
    } catch (err: any) {
      setSimLogs((prev) => [...prev, `[WEBHOOK ERROR] Failed to trigger cancellation: ${err.message || 'Error'}`]);
      throw err;
    }
  };

  const revealOrderCredentials = (u: string, p: string, title?: string) => {
    setActiveOrder((prev) => ({ ...prev, type: 'account', title: title || prev.title, username: u, password: p }));
    openModal('fulfillment');
  };

  const seedNewDemoOrder = () => {
    setCustomerOrders((prev) => [{
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000), ref: 'IQB-TX-' + Math.floor(100000 + Math.random() * 900000),
      title: 'Blox Fruits Perm Dragon + Godhuman', type: 'Account Purchase', date: 'Just now', amount: 850, status: 'PAID',
      revealedUser: 'dragon_blox_king', revealedPass: 'PermDragon#2025',
    }, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      currentView, switchView, authMode, setAuthMode, user, login, register, logout,
      banners, accountProducts, packagesData, topupGamesMeta, refreshStoreCatalog, activeTopupGame, selectedPackage,
      uidInput, setUidInput, robloxUser, setRobloxUser, robloxPass, setRobloxPass,
      selectTopupGame, selectPackage, handleTopupCheckout, buyAccount,
      customerOrders, seedNewDemoOrder, revealOrderCredentials,
      isModalOpen, modalState, activeOrder, syncActiveOrder, openModal, closeModal, setModalState,
      openSimulatorDirectly, simLogs, simulateQRUpload, triggerWebhookSuccess, triggerWebhookFailed,
      selectedAccountForDetail, openAccountDetail, closeAccountDetail, isAuthPromptOpen, closeAuthPrompt,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}

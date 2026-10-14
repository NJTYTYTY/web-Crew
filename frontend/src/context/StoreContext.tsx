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
  fetchOrderStatusApi, fetchTopupGamesApi, loginApi, logoutApi, normalizeAccounts,
  normalizeBanners, normalizeTopupGames, normalizeTopupGamesMeta, registerApi, setStoredToken, triggerIqBankSimulatorApi,
} from '@/lib/api';

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
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(initialCustomerOrders);
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
      const m = normalizeTopupGames(r);
      const meta = normalizeTopupGamesMeta(r);
      if (meta) setTopupGamesMeta(meta);
      if (m) { setPackagesData(m); setSelectedPackage((prev) => m.rov.find((p) => p.id === prev?.id) || m.rov[2] || m.rov[0]); }
    }).catch(() => {});
  }, []);

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
    refreshStoreCatalog();
    fetchMeApi().then((r) => {
      const u = r?.user || r;
      if (u?.username) setUser({ id: u.id, username: u.username, role: u.role || 'CUSTOMER' });
    }).catch(() => {});
    try {
      const savedOrder = localStorage.getItem('nexusplay_active_order');
      if (savedOrder) { const p = JSON.parse(savedOrder); if (p?.txRef) setActiveOrder(p); }
    } catch {}
    const onFocus = () => refreshStoreCatalog();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshStoreCatalog]);

  useEffect(() => {
    const applyCrossTabSuccess = (orderData?: ActiveOrder) => {
      const ord = orderData || activeOrder;
      setCustomerOrders((prev) => prev.some((o) => o.ref === ord.txRef) ? prev : [{
        id: ord.id, ref: ord.txRef, title: ord.title,
        type: ord.type === 'account' ? 'Account Purchase' : 'Top-Up Delivery',
        date: 'Just now', amount: ord.price, status: 'PAID',
        revealedUser: ord.username || 'auto_delivery',
        revealedPass: ord.type === 'account' ? ord.password || 'NexPass#7741' : 'COMPLETED',
      }, ...prev]);
      refreshStoreCatalog();
      if (!window.location.pathname.startsWith('/iq-bank-simulator')) { setModalState('success'); setIsModalOpen(true); }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nexusplay_active_order' && e.newValue) { try { const p = JSON.parse(e.newValue); if (p?.txRef) setActiveOrder(p); } catch {} }
      if (e.key === 'nexusplay_payment_event' && e.newValue) { try { const evt = JSON.parse(e.newValue); if (evt?.status === 'SUCCESS') applyCrossTabSuccess(evt.order); } catch {} }
      refreshStoreCatalog();
    };
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('nexusplay_payment_channel');
      bc.onmessage = (ev) => {
        if (ev.data?.type === 'ACTIVE_ORDER' && ev.data?.order) setActiveOrder(ev.data.order);
        if (ev.data?.type === 'PAYMENT_SUCCESS') applyCrossTabSuccess(ev.data.order);
      };
    }
    window.addEventListener('storage', onStorage);
    return () => { window.removeEventListener('storage', onStorage); if (bc) bc.close(); };
  }, [activeOrder, refreshStoreCatalog]);

  useEffect(() => {
    if (!isModalOpen || modalState !== 'waiting' || !activeOrder.dbId) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetchOrderStatusApi(activeOrder.dbId!);
        if ((res?.status || res?.order?.status) === 'PAID') {
          const creds = res?.credentials || res?.order?.credentials;
          if (creds?.accountUsername) setActiveOrder((prev) => ({ ...prev, username: creds.accountUsername, password: creds.accountPassword || prev.password }));
          setModalState('success');
          refreshStoreCatalog();
        }
      } catch {}
    }, 2000);
    return () => clearInterval(timer);
  }, [isModalOpen, modalState, activeOrder.dbId, refreshStoreCatalog]);

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
    const pkgs = packagesData[gameKey] || initialPackagesData[gameKey];
    setSelectedPackage(pkgs[2] || pkgs[0]);
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
    try {
      const res = await createOrderApi({ orderType: 'ACCOUNT', gameAccountId: acc.dbId ?? 1 });
      id = res?.order?.orderNumber || id; dbId = res?.order?.id; txRef = res?.payment?.transactionRef || txRef;
    } catch {}
    syncActiveOrder({ id, dbId, txRef, title: acc.title, type: 'account', price: acc.price, username: acc.revealedUser, password: acc.revealedPass, date: 'Just now' });
    setSimLogs((prev) => [...prev, `[INFO] New pending order created. Active Ref: ${txRef} (฿${acc.price})`]);
    openModal('waiting');
  };

  const executeTopupCheckout = async () => {
    const gameLabel = topupGamesMeta[activeTopupGame]?.name || (activeTopupGame === 'roblox' ? 'Roblox Robux' : activeTopupGame === 'rov' ? 'RoV Coupons' : 'Free Fire Diamonds');
    const price = selectedPackage ? selectedPackage.price : 95;
    let id = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    let txRef = 'IQB-TX-' + Math.floor(100000 + Math.random() * 900000);
    let dbId: number | undefined;
    try {
      const res = await createOrderApi({
        orderType: 'TOPUP', topupPackageId: selectedPackage?.dbId ?? 1,
        targetMetadata: activeTopupGame === 'roblox' ? { robloxUsername: robloxUser, robloxPassword: robloxPass } : { playerUid: uidInput },
      });
      id = res?.order?.orderNumber || id; dbId = res?.order?.id; txRef = res?.payment?.transactionRef || txRef;
    } catch {}
    syncActiveOrder({ id, dbId, txRef, title: `${gameLabel} - ${selectedPackage?.label || 'Package'}`, type: 'topup', price, username: activeTopupGame === 'roblox' ? robloxUser : `UID: ${uidInput}`, date: 'Just now' });
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

  const login = async (username: string, password: string) => {
    try {
      const res = await loginApi(username, password);
      if (res?.token) setStoredToken(res.token);
      setUser({ id: res?.user?.id, username: res?.user?.username || username, role: res?.user?.role || 'CUSTOMER' });
      const ordRes = await fetchOrdersApi().catch(() => null);
      if (Array.isArray(ordRes?.orders) && ordRes.orders.length > 0) setCustomerOrders(ordRes.orders);
    } catch { setUser({ username, role: 'CUSTOMER' }); }
    await finishAuthAndResume(pendingPurchase);
  };

  const register = async (username: string, password: string, confirmPassword: string) => {
    try {
      const res = await registerApi(username, password, confirmPassword);
      if (res?.token) setStoredToken(res.token);
      setUser({ id: res?.user?.id, username: res?.user?.username || username, role: res?.user?.role || 'CUSTOMER' });
    } catch { setUser({ username, role: 'CUSTOMER' }); }
    await finishAuthAndResume(pendingPurchase);
  };

  const logout = async () => { await logoutApi().catch(() => {}); setStoredToken(null); setUser(null); };

  const simulateQRUpload = () => {
    setSimLogs((prev) => [...prev, '[QR SCANNER] Detected EMVCo PromptPay QR Code!', `[PAYLOAD] Merch: NEXUS PLAY | Ref: ${activeOrder.txRef} | Amt: ฿${activeOrder.price}`]);
  };

  const triggerWebhookSuccess = async () => {
    await triggerIqBankSimulatorApi({ transactionRef: activeOrder.txRef, status: 'SUCCESS', amount: activeOrder.price }).catch(() => {});
    setSimLogs((prev) => [...prev, '[WEBHOOK DISPATCH] POST /api/webhooks/iqbank HTTP/1.1 (200 OK)', `[IQ-BANK SUCCESS] Payment verified for ${activeOrder.txRef}. Amount: ฿${activeOrder.price} — Storefront tab updated!`]);
    setCustomerOrders((prev) => [{
      id: activeOrder.id, ref: activeOrder.txRef, title: activeOrder.title,
      type: activeOrder.type === 'account' ? 'Account Purchase' : 'Top-Up Delivery',
      date: 'Just now', amount: activeOrder.price, status: 'PAID',
      revealedUser: activeOrder.username || 'auto_delivery',
      revealedPass: activeOrder.type === 'account' ? activeOrder.password || 'NexPass#7741' : 'COMPLETED',
    }, ...prev]);
    try {
      localStorage.setItem('nexusplay_payment_event', JSON.stringify({ status: 'SUCCESS', txRef: activeOrder.txRef, order: activeOrder, ts: Date.now() }));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('nexusplay_payment_channel');
        bc.postMessage({ type: 'PAYMENT_SUCCESS', order: activeOrder });
        bc.close();
      }
    } catch {}
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/iq-bank-simulator')) openModal('success');
  };

  const triggerWebhookFailed = async () => {
    await triggerIqBankSimulatorApi({ transactionRef: activeOrder.txRef, status: 'FAILED', amount: activeOrder.price }).catch(() => {});
    setSimLogs((prev) => [...prev, '[WEBHOOK ERROR] Transaction canceled or expired by user bank app.']);
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
      isModalOpen, modalState, activeOrder, openModal, closeModal, setModalState,
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

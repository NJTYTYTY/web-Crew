'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AccountProduct, ActiveOrder, AuthMode, BannerItem, CustomerOrder,
  ModalStateName, PackagesByGame, StoreContextValue, StoreViewName, TopupGameKey, TopupPackage, UserProfile,
} from '@/types/store';
import {
  defaultActiveOrder, initialAccountProducts, initialBanners, initialCustomerOrders, initialPackagesData,
} from '@/data/mockStoreData';
import {
  createOrderApi, fetchAccountsApi, fetchBannersApi, fetchMeApi, fetchOrdersApi,
  fetchOrderStatusApi, fetchTopupGamesApi, loginApi, logoutApi, normalizeAccounts,
  normalizeBanners, normalizeTopupGames, registerApi, setStoredToken, triggerIqBankSimulatorApi,
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

  useEffect(() => {
    if (!pathname) return;
    if (pathname === '/') setCurrentView('home');
    else if (pathname.startsWith('/accounts')) setCurrentView('accounts');
    else if (pathname.startsWith('/topup')) setCurrentView('topup');
    else if (pathname.startsWith('/orders')) setCurrentView('orders');
    else if (pathname.startsWith('/login')) { setCurrentView('auth'); setAuthMode('login'); }
    else if (pathname.startsWith('/register')) { setCurrentView('auth'); setAuthMode('register'); }
    else if (pathname.startsWith('/iq-bank-simulator')) setCurrentView('simulator');
  }, [pathname]);

  useEffect(() => {
    fetchBannersApi().then((r) => { const b = normalizeBanners(r); if (b) setBanners(b); }).catch(() => {});
    fetchAccountsApi().then((r) => { const a = normalizeAccounts(r); if (a) setAccountProducts(a); }).catch(() => {});
    fetchTopupGamesApi().then((r) => {
      const m = normalizeTopupGames(r);
      if (m) { setPackagesData(m); setSelectedPackage(m.rov[2] || m.rov[0]); }
    }).catch(() => {});
    fetchMeApi().then((r) => {
      const u = r?.user || r;
      if (u?.username) setUser({ id: u.id, username: u.username, role: u.role || 'CUSTOMER' });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isModalOpen || modalState !== 'waiting' || !activeOrder.dbId) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetchOrderStatusApi(activeOrder.dbId!);
        if ((res?.status || res?.order?.status) === 'PAID') {
          const creds = res?.credentials || res?.order?.credentials;
          if (creds?.accountUsername) {
            setActiveOrder((prev) => ({ ...prev, username: creds.accountUsername, password: creds.accountPassword || prev.password }));
          }
          setModalState('success');
        }
      } catch {}
    }, 2000);
    return () => clearInterval(timer);
  }, [isModalOpen, modalState, activeOrder.dbId]);

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
  const openSimulatorDirectly = () => { setIsModalOpen(false); switchView('simulator'); };
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
      id = res?.order?.orderNumber || id;
      dbId = res?.order?.id;
      txRef = res?.payment?.transactionRef || txRef;
    } catch {}
    setActiveOrder({ id, dbId, txRef, title: acc.title, type: 'account', price: acc.price, username: acc.revealedUser, password: acc.revealedPass, date: 'Just now' });
    setSimLogs((prev) => [...prev, `[INFO] New pending order created. Active Ref: ${txRef} (฿${acc.price})`]);
    openModal('waiting');
  };

  const executeTopupCheckout = async () => {
    const gameLabel = activeTopupGame === 'roblox' ? 'Roblox Robux' : activeTopupGame === 'rov' ? 'RoV Coupons' : 'Free Fire Diamonds';
    const price = selectedPackage ? selectedPackage.price : 95;
    let id = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    let txRef = 'IQB-TX-' + Math.floor(100000 + Math.random() * 900000);
    let dbId: number | undefined;
    try {
      const res = await createOrderApi({
        orderType: 'TOPUP', topupPackageId: selectedPackage?.dbId ?? 1,
        targetMetadata: activeTopupGame === 'roblox' ? { robloxUsername: robloxUser, robloxPassword: robloxPass } : { playerUid: uidInput },
      });
      id = res?.order?.orderNumber || id;
      dbId = res?.order?.id;
      txRef = res?.payment?.transactionRef || txRef;
    } catch {}
    setActiveOrder({
      id, dbId, txRef, title: `${gameLabel} - ${selectedPackage?.label || 'Package'}`,
      type: 'topup', price, username: activeTopupGame === 'roblox' ? robloxUser : `UID: ${uidInput}`, date: 'Just now',
    });
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
    setIsAuthPromptOpen(false);
    setPendingPurchase(null);
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
    setSimLogs((prev) => [...prev, '[WEBHOOK DISPATCH] POST /api/webhooks/iqbank HTTP/1.1 (200 OK)', `[IQ-BANK SUCCESS] Payment verified for ${activeOrder.txRef}. Amount: ฿${activeOrder.price}`]);
    setCustomerOrders((prev) => [{
      id: activeOrder.id, ref: activeOrder.txRef, title: activeOrder.title,
      type: activeOrder.type === 'account' ? 'Account Purchase' : 'Top-Up Delivery',
      date: 'Just now', amount: activeOrder.price, status: 'PAID',
      revealedUser: activeOrder.username || 'auto_delivery',
      revealedPass: activeOrder.type === 'account' ? activeOrder.password || 'NexPass#7741' : 'COMPLETED',
    }, ...prev]);
    openModal('success');
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
      banners, accountProducts, packagesData, activeTopupGame, selectedPackage,
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

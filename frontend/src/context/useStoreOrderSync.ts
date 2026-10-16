'use client';

import { useEffect } from 'react';
import { ActiveOrder, ModalStateName } from '@/types/store';
import { fetchOrderStatusApi } from '@/lib/api';

interface UseStoreOrderSyncProps {
  isModalOpen: boolean;
  modalState: ModalStateName;
  activeOrder: ActiveOrder;
  setActiveOrder: React.Dispatch<React.SetStateAction<ActiveOrder>>;
  setModalState: React.Dispatch<React.SetStateAction<ModalStateName>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshStoreCatalog: () => void;
}

export function useStoreOrderSync({
  isModalOpen,
  modalState,
  activeOrder,
  setActiveOrder,
  setModalState,
  setIsModalOpen,
  refreshStoreCatalog,
}: UseStoreOrderSyncProps) {
  // Cross-tab and BroadcastChannel sync
  useEffect(() => {
    const applyCrossTabSuccess = async (orderData?: ActiveOrder) => {
      const ord = orderData || activeOrder;
      if (ord.dbId) {
        try {
          const st = await fetchOrderStatusApi(ord.dbId);
          const creds = st?.credentials || st?.order?.credentials;
          if (creds?.accountUsername) {
            setActiveOrder((prev) => ({ ...prev, username: creds.accountUsername, password: creds.accountPassword || prev.password }));
          }
        } catch {}
      }
      refreshStoreCatalog();
      if (!window.location.pathname.startsWith('/iq-bank-simulator')) {
        setModalState('success');
        setIsModalOpen(true);
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nexusplay_active_order' && e.newValue) {
        try { const p = JSON.parse(e.newValue); if (p?.txRef) setActiveOrder(p); } catch {}
      }
      if (e.key === 'nexusplay_payment_event' && e.newValue) {
        try { const evt = JSON.parse(e.newValue); if (evt?.status === 'SUCCESS') applyCrossTabSuccess(evt.order); } catch {}
      }
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
    return () => {
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, [activeOrder, refreshStoreCatalog, setActiveOrder, setIsModalOpen, setModalState]);

  // 2s polling for active waiting order
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
          refreshStoreCatalog();
        }
      } catch {}
    }, 2000);
    return () => clearInterval(timer);
  }, [isModalOpen, modalState, activeOrder.dbId, refreshStoreCatalog, setActiveOrder, setModalState]);
}

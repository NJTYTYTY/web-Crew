'use client';

import React from 'react';
import { StoreShell } from '@/components/layout/StoreShell';
import { OrdersView } from '@/components/views/OrdersView';

export default function OrdersPage() {
  return (
    <StoreShell>
      <OrdersView />
    </StoreShell>
  );
}

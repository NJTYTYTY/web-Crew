'use client';

import React from 'react';
import { StoreShell } from '@/components/layout/StoreShell';
import { AccountMarketplaceView } from '@/components/views/AccountMarketplaceView';

export default function AccountsPage() {
  return (
    <StoreShell>
      <AccountMarketplaceView />
    </StoreShell>
  );
}

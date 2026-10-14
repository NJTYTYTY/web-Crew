'use client';

import React from 'react';
import { StoreShell } from '@/components/layout/StoreShell';
import { GameTopupView } from '@/components/views/GameTopupView';

export default function TopupPage() {
  return (
    <StoreShell>
      <GameTopupView />
    </StoreShell>
  );
}

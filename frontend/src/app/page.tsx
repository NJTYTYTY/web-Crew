'use client';

import React from 'react';
import { StoreShell } from '@/components/layout/StoreShell';
import { HomeView } from '@/components/views/HomeView';

export default function HomePage() {
  return (
    <StoreShell>
      <HomeView />
    </StoreShell>
  );
}

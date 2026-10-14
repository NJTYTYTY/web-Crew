'use client';

import React from 'react';
import { StoreShell } from '@/components/layout/StoreShell';
import { SimulatorView } from '@/components/views/SimulatorView';

export default function IqBankSimulatorPage() {
  return (
    <StoreShell>
      <SimulatorView />
    </StoreShell>
  );
}

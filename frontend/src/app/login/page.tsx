'use client';

import React from 'react';
import { StoreShell } from '@/components/layout/StoreShell';
import { AuthView } from '@/components/views/AuthView';

export default function LoginPage() {
  return (
    <StoreShell>
      <AuthView initialMode="login" />
    </StoreShell>
  );
}

'use client';

import React from 'react';
import { StoreShell } from '@/components/layout/StoreShell';
import { AuthView } from '@/components/views/AuthView';

export default function RegisterPage() {
  return (
    <StoreShell>
      <AuthView initialMode="register" />
    </StoreShell>
  );
}

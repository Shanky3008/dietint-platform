'use client';

import { useEffect } from 'react';

export default function SWRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered', reg);
        } catch (err) {
          console.log('SW registration failed', err);
        }
      };
      register();
    }
  }, []);
  return null;
}


'use client';

import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay if not iOS
      if (!isIOSDevice) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000); // Show after 3 seconds
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show iOS instructions if it's iOS and not installed
    if (isIOSDevice && !isInstalled) {
      setTimeout(() => {
        setShowIOSInstructions(true);
      }, 5000); // Show after 5 seconds on iOS
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    setShowInstallPrompt(false);
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleIOSDismiss = () => {
    setShowIOSInstructions(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-ios-dismissed', Date.now().toString());
  };

  // Don't show if already installed or dismissed
  if (isInstalled || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  // Check if iOS instructions were dismissed recently
  const iosDismissed = localStorage.getItem('pwa-ios-dismissed');
  if (iosDismissed && Date.now() - parseInt(iosDismissed) < 7 * 24 * 60 * 60 * 1000) {
    return null;
  }

  return (
    <>
      {/* Chrome/Edge Install Prompt */}
      <Dialog 
        open={showInstallPrompt} 
        onClose={handleDismiss}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GetAppIcon color="primary" />
          Install NutriConnect
          <IconButton
            aria-label="close"
            onClick={handleDismiss}
            sx={{ ml: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <PhoneAndroidIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Get the full app experience!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Install NutriConnect on your device for:
            </Typography>
            
            <Box component="ul" sx={{ textAlign: 'left', pl: 3 }}>
              <li>🚀 Faster loading times</li>
              <li>📱 Full-screen experience</li>
              <li>🔔 Push notifications for appointments</li>
              <li>💾 Offline access to your data</li>
              <li>🎯 Quick access from home screen</li>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleDismiss} variant="outlined">
            Maybe Later
          </Button>
          <Button 
            onClick={handleInstallClick} 
            variant="contained" 
            size="large"
            startIcon={<GetAppIcon />}
          >
            Install App
          </Button>
        </DialogActions>
      </Dialog>

      {/* iOS Install Instructions */}
      <Dialog 
        open={showIOSInstructions} 
        onClose={handleIOSDismiss}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneAndroidIcon color="primary" />
          Install on iOS
          <IconButton
            aria-label="close"
            onClick={handleIOSDismiss}
            sx={{ ml: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add NutriConnect to your home screen
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              To install this app on your iOS device:
            </Typography>
            
            <Box component="ol" sx={{ pl: 3, '& li': { mb: 1 } }}>
              <li>
                <Typography variant="body2">
                  Tap the <strong>Share</strong> button <span style={{ fontSize: '16px' }}>⬆️</span> at the bottom of your browser
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Scroll down and tap <strong>"Add to Home Screen"</strong> <span style={{ fontSize: '16px' }}>➕</span>
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Tap <strong>"Add"</strong> in the top-right corner
                </Typography>
              </li>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
              The app will appear on your home screen like a native app!
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleIOSDismiss} variant="contained" fullWidth>
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PWAInstallPrompt;
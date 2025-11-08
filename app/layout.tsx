import ThemeRegistry from '@/components/ThemeRegistry';
import './globals.css';

export const metadata = {
  title: 'CoachPulse - Platform for Health & Wellness Coaches',
  description: 'Manage your coaching clients with smart alerts and automated nudges. ₹200 per client per month. Never lose a client to neglect again.',
  applicationName: 'CoachPulse',
  manifest: '/manifest.json',
  themeColor: '#2E7D32',
  openGraph: {
    type: 'website',
    title: 'CoachPulse - Platform for Health & Wellness Coaches',
    description: 'Manage your coaching clients with smart alerts and automated nudges. ₹200 per client per month. Never lose a client to neglect again.',
    siteName: 'CoachPulse',
    url: 'https://coachpulse.in',
    images: [{ url: '/images/coachpulse-og.jpg', width: 1200, height: 630, alt: 'CoachPulse - The Intelligent Platform for Coaches' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoachPulse - Platform for Health & Wellness Coaches',
    description: 'Manage your coaching clients with smart alerts and automated nudges. ₹200 per client per month.',
    images: ['/images/coachpulse-og.jpg']
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: ['/icons/icon-192x192.svg', '/icons/icon-152x152.svg', '/icons/icon-192x192.svg']
  }
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}

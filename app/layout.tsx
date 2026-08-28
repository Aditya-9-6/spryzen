import type { Metadata } from 'next';
import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap', weight: ['300','400','500','600','700','800','900'] });
const inter  = Inter({ subsets: ['latin'], variable: '--font-inter',  display: 'swap' });
const mono   = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400','500','700'] });

export const metadata: Metadata = {
  title: {
    default: 'Spryzen+ | Sovereign AI Security Engine',
    template: '%s | Spryzen+',
  },
  description: 'The world\'s first self-evolving, sovereign AI WAF. 99.9% attack detection. 62.8% cheaper than Cloudflare. On-premise, zero-dependency security for enterprise.',
  keywords: ['WAF', 'web application firewall', 'AI security', 'DDoS protection', 'cybersecurity India', 'enterprise security', 'Razorpay', 'DPDP compliance'],
  authors: [{ name: 'Spryzen Security Systems' }],
  creator: 'Spryzen Security Systems Pvt. Ltd.',
  publisher: 'Spryzen+',
  metadataBase: new URL('https://spryzen.plus'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://spryzen.plus',
    siteName: 'Spryzen+',
    title: 'Spryzen+ | Sovereign AI Security Engine',
    description: 'The world\'s first self-evolving WAF. 99.9% detection. 62% cheaper than Cloudflare.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Spryzen+ - Sovereign AI Security Engine',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spryzen+ | Sovereign AI Security Engine',
    description: 'Self-evolving WAF with 99.9% detection. Free trial available.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: { canonical: 'https://spryzen.plus' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Spryzen+',
              applicationCategory: 'SecurityApplication',
              operatingSystem: 'Linux, Windows',
              description: 'Sovereign AI security engine with self-evolving WAF, honeypot deception, and autonomous SOC.',
              url: 'https://spryzen.plus',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                priceValidUntil: '2027-12-31',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '127',
              },
            }),
          }}
        />
      </head>
      <body>
        <Navbar />
        <main style={{ paddingTop: '72px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

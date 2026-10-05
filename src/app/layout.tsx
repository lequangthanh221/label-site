import type { Metadata, Viewport } from 'next';
import { Inter_Tight } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import { site } from '@/config/site';
import { ALLOW_INDEX, JsonLd, SITE_URL } from '@/lib/seo';
import '@/styles/global.css';
import '@/styles/components/header.css';
import '@/styles/components/footer.css';
import '@/styles/components/logo.css';
import '@/styles/components/card.css';
import '@/styles/components/contact.css';
import '@/styles/components/stats.css';
import '@/styles/components/cta-band.css';
import '@/styles/pages/home.css';
import '@/styles/pages/detail.css';
import '@/styles/pages/about.css';
import '@/styles/pages/not-found.css';

const font = Inter_Tight({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: site.name,
  description: site.description,
  icons: { icon: '/brand/favicon.svg' },
  robots: ALLOW_INDEX ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#040b18' };

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  legalName: site.legalName,
  url: SITE_URL,
  logo: new URL(site.logo, SITE_URL).toString(),
  telephone: site.contact.phone,
  email: site.contact.email,
  address: site.contact.address,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={font.variable}>
      <body id="top">
        {/* không có JS: hiện luôn các khối có hiệu ứng */}
        <noscript><style>{'[data-reveal],[data-reveal] .w{opacity:1!important;filter:none!important;transform:none!important}'}</style></noscript>
        <JsonLd data={organization} />
        <Header />
        <main>{children}</main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}

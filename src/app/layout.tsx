import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/context/AuthProvider';

export const metadata: Metadata = {
  title: "PropertyVerify",
  description: "Verify your properties",
};

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className={`${raleway.className} h-full antialiased overscroll-none`}
      >
        {/* Inject manifest and theme color link for PWA */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try{
              var link = document.createElement('link');
              link.rel = 'manifest';
              link.href = '/manifest.json';
              document.head.appendChild(link);
              var meta = document.createElement('meta');
              meta.name = 'theme-color';
              meta.content = '#10B981';
              document.head.appendChild(meta);
            }catch(e){console.warn(e)}
          })();
        ` }} />
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* Service worker registration (PWA stub) */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function(err) {
                console.warn('ServiceWorker registration failed:', err);
              });
            });
          }
        ` }} />
      </body>
    </html>
  );
}

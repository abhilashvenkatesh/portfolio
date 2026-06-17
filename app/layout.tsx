import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/providers/Providers";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { getIdentity, getContactInfo } from "@/lib/content";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const identity = getIdentity();
const contact = getContactInfo();

export const metadata: Metadata = {
  title: `${identity.name} — ${identity.title}`,
  description: `${identity.title} based in ${identity.location}`,
};

const ANTI_FLASH = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-primary">
        <Providers>
          <Nav email={contact.email} />
          <main className="flex-1 pt-15">{children}</main>
          <Footer email={contact.email} linkedin={contact.linkedin} github={contact.github} />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

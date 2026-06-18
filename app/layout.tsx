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
  metadataBase: new URL("https://avbuild.dev"),
  title: {
    default: `${identity.name} — ${identity.title}`,
    template: `%s | ${identity.name}`,
  },
  description: `${identity.title} with 11+ years building distributed systems, cloud infrastructure, and engineering teams. Based in ${identity.location}.`,
  authors: [{ name: identity.name, url: "https://avbuild.dev" }],
  openGraph: {
    type: "website",
    siteName: identity.name,
    locale: "en_AU",
    url: "https://avbuild.dev",
    title: `${identity.name} — ${identity.title}`,
    description: `${identity.title} with 11+ years building distributed systems, cloud infrastructure, and engineering teams. Based in ${identity.location}.`,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: identity.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — ${identity.title}`,
    description: `${identity.title} with 11+ years building distributed systems, cloud infrastructure, and engineering teams. Based in ${identity.location}.`,
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
};

const ANTI_FLASH = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
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
          <Nav email={contact.email} firstName={identity.firstName} />
          <main className="flex-1 pt-15">{children}</main>
          <Footer email={contact.email} linkedin={contact.linkedin} github={contact.github} firstName={identity.firstName} />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

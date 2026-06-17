import type { Metadata } from "next";
import Hero from "@/components/home/Hero";

export const metadata: Metadata = {
  title: "Abhilash Venkatesh — Lead Application Developer",
  description:
    "Lead Application Developer with 11+ years building distributed systems, cloud infrastructure, and engineering teams across Australia and India. Based in Melbourne.",
  alternates: { canonical: "https://avbuild.dev" },
  openGraph: {
    url: "https://avbuild.dev",
    title: "Abhilash Venkatesh — Lead Application Developer",
    description:
      "Lead Application Developer with 11+ years building distributed systems, cloud infrastructure, and engineering teams across Australia and India. Based in Melbourne.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abhilash Venkatesh",
  url: "https://avbuild.dev",
  jobTitle: "Lead Application Developer",
  worksFor: { "@type": "Organization", name: "Fabric Group" },
  address: { "@type": "PostalAddress", addressLocality: "Melbourne", addressCountry: "AU" },
  sameAs: [
    "https://github.com/abhilash-venkatesh",
    "https://linkedin.com/in/abhilash-venkatesh",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
    </>
  );
}

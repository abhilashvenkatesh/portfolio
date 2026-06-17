import type { Metadata } from "next";
import { getContactInfo, getIdentity } from "@/lib/content";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import ContactCard from "@/components/contact/ContactCard";
import AvailabilityBanner from "@/components/contact/AvailabilityBanner";

const identity = getIdentity();

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${identity.name} — open to full-time roles and select consulting engagements.`,
  alternates: { canonical: "https://avbuild.dev/contact" },
  openGraph: {
    url: "https://avbuild.dev/contact",
    title: `Contact | ${identity.name}`,
    description: `Get in touch with ${identity.name} — open to full-time roles and select consulting engagements.`,
  },
};

const EmailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 9l10 6 10-6" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

export default async function ContactPage() {
  const contact = getContactInfo();

  const channels = [
    {
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      description: "Best for work enquiries and opportunities",
      icon: <EmailIcon />,
      newTab: false,
    },
    {
      label: "LinkedIn",
      value: contact.linkedin.replace("https://", ""),
      href: contact.linkedin,
      description: "Professional history and recommendations",
      icon: <LinkedInIcon />,
      newTab: true,
    },
    {
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
      description: "Melbourne, VIC, Australia (AEST/AEDT)",
      icon: <PhoneIcon />,
      newTab: false,
    },
  ];

  return (
    <>
      <PageHeader label="Get in touch" subtitle="Let's work together" />
      <div className="px-6 pb-24 pt-10">
        <div className="mx-auto max-w-[640px]">
          <FadeIn>
            <p className="mb-14 text-center text-[17px] leading-[1.75] text-secondary">
              I&apos;m currently open to full-time roles and select consulting
              engagements. If you&apos;re building something interesting, I&apos;d
              love to hear about it.
            </p>
          </FadeIn>

          <div className="flex flex-col gap-3.5">
            {channels.map((channel, i) => (
              <FadeIn key={channel.label} delay={i * 60}>
                <ContactCard
                  label={channel.label}
                  value={channel.value}
                  href={channel.href}
                  description={channel.description}
                  icon={channel.icon}
                  newTab={channel.newTab}
                />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={240}>
            <div className="mt-10">
              <AvailabilityBanner
                show={contact.availability.show}
                message={contact.availability.message}
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}

import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { mainNav } from "@/config/nav";
import { siteConfig, whatsappLink, telLink } from "@/config/site";
import { Logo } from "./Logo";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  WhatsappIcon,
} from "@/components/icons/social";

const discover = [
  { key: "istTransfer", href: "/booking" },
  { key: "sawTransfer", href: "/booking" },
  { key: "antalya", href: "/booking" },
  { key: "bodrum", href: "/booking" },
  { key: "izmir", href: "/booking" },
  { key: "dalaman", href: "/booking" },
] as const;

const legal = [
  { key: "privacy", href: "/legal/privacy" },
  { key: "terms", href: "/legal/terms" },
  { key: "passengerContract", href: "/legal/passenger-agreement" },
  { key: "purchaseContract", href: "/legal/purchase-agreement" },
  { key: "dataProtection", href: "/legal/data-protection" },
] as const;

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sea text-canvas/80">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + contact */}
          <div>
            <Link href="/" aria-label={siteConfig.name}>
              <Logo tone="light" className="text-3xl" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-canvas/70">
              {t("tagline")}
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={telLink()} className="inline-flex items-center gap-3 hover:text-canvas transition-colors">
                  <Phone className="size-4 text-gold" aria-hidden />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-3 hover:text-canvas transition-colors">
                  <Mail className="size-4 text-gold" aria-hidden />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-3">
                <MapPin className="size-4 text-gold mt-0.5 shrink-0" aria-hidden />
                <span>
                  {siteConfig.contact.address.line1}, {siteConfig.contact.address.city}
                </span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <SocialLink href={whatsappLink()} label="WhatsApp">
                <WhatsappIcon className="size-[1.125rem]" />
              </SocialLink>
              {siteConfig.social.instagram && (
                <SocialLink href={siteConfig.social.instagram} label="Instagram">
                  <InstagramIcon className="size-[1.125rem]" />
                </SocialLink>
              )}
              {siteConfig.social.facebook && (
                <SocialLink href={siteConfig.social.facebook} label="Facebook">
                  <FacebookIcon className="size-[1.125rem]" />
                </SocialLink>
              )}
              {siteConfig.social.youtube && (
                <SocialLink href={siteConfig.social.youtube} label="YouTube">
                  <YoutubeIcon className="size-[1.125rem]" />
                </SocialLink>
              )}
            </div>
          </div>

          {/* Company */}
          <FooterColumn title={t("company")}>
            {mainNav.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {tNav(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Discover */}
          <FooterColumn title={t("discover")}>
            {discover.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(`discoverLinks.${item.key}`)}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Legal */}
          <FooterColumn title={t("legal")}>
            {legal.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(`links.${item.key}`)}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-14 pt-8 border-t border-canvas/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-canvas/60">
          <p>
            © {year} {siteConfig.legalName}. {t("rights")}
          </p>
          <p className="flex items-center gap-2">
            <span>{t("securePayment")}</span>
            <span aria-hidden>·</span>
            <span>{t("madeWith")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.18em] text-canvas/50 font-medium">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-canvas/70 hover:text-canvas transition-colors">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center size-10 rounded-full border border-canvas/20 text-canvas/80 hover:border-gold hover:text-gold transition-colors"
    >
      {children}
    </a>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeartHandshake, BadgeEuro, MapPin, ShieldCheck, Mail } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { CtaBand } from "@/components/sections/CtaBand";
import { InstagramIcon } from "@/components/icons/social";
import { siteConfig } from "@/config/site";
import { localize } from "@/lib/utils";
import { stockImage, BLUR_DATA_URL } from "@/lib/images";
import { getTeam, getMilestones } from "@/lib/content";
import { partners } from "@/data/about";

const values = [
  { key: "care", Icon: HeartHandshake },
  { key: "trust", Icon: BadgeEuro },
  { key: "local", Icon: MapPin },
  { key: "safety", Icon: ShieldCheck },
] as const;

const stats = [
  { key: "years", value: "10+" },
  { key: "guests", value: "120k+" },
  { key: "fleet", value: "60+" },
  { key: "guides", value: "25+" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("about.title"),
    description: t("about.description", { siteName: siteConfig.name }),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });
  const [team, milestones] = await Promise.all([getTeam(), getMilestones()]);

  return (
    <>
      {/* Split hero + asymmetric image collage */}
      <section className="border-b border-line bg-canvas">
        <div className="shell pt-14 md:pt-20 pb-14 md:pb-16">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <Reveal>
              <p className="eyebrow">{t("eyebrow")}</p>
              <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[1.03] text-balance">
                {t("title")}
              </h1>
            </Reveal>
            <Reveal>
              <p className="text-lg leading-relaxed text-muted text-pretty lg:pb-2">
                {t("lead", { siteName: siteConfig.name })}
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-10">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[340px]">
              <div className="relative col-span-2 h-[240px] overflow-hidden rounded-3xl md:h-auto">
                <Image
                  src={stockImage("about-hero-mountains", 1400, 1000)}
                  alt=""
                  fill
                  priority
                  sizes="(min-width:768px) 50vw, 100vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
              <div className="relative h-[240px] overflow-hidden rounded-3xl md:h-auto">
                <Image
                  src={stockImage("about-valley", 700, 900)}
                  alt=""
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
              <div className="relative h-[240px] overflow-hidden rounded-3xl md:h-auto">
                <Image
                  src={stockImage("about-forest-path", 700, 900)}
                  alt=""
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Collective block */}
      <Section tone="canvas">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="text-3xl md:text-4xl text-balance">
              {t("collective.title")}
            </h2>
          </Reveal>
          <Reveal>
            <p className="leading-relaxed text-muted">{t("collective.body")}</p>
            <p className="mt-4 leading-relaxed text-muted">{t("body")}</p>
          </Reveal>
        </div>
      </Section>

      {/* Stats band */}
      <Section tone="sea" className="py-16 md:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.08} className="text-center">
              <div className="font-display text-5xl md:text-6xl text-gold">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-canvas/70">
                {t(`stats.${s.key}`)}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Our Story timeline */}
      <Section tone="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              align="start"
              eyebrow={t("story.eyebrow")}
              title={t("story.title")}
              subtitle={t("story.subtitle")}
            />
            <Reveal className="mt-8">
              <Parallax className="aspect-[4/3] rounded-3xl" distance={36}>
                <Image
                  src={stockImage("about-story-summit", 1000, 750)}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 34rem, 90vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </Parallax>
            </Reveal>
          </div>

          <Reveal>
            <ol className="relative ms-3 space-y-9 border-s border-line ps-8">
              {milestones.map((m) => (
                <li key={m.year} className="relative">
                  <span className="absolute -start-[2.15rem] top-1.5 size-3 rounded-full bg-terracotta ring-4 ring-shell" />
                  <div className="font-display text-2xl text-terracotta">
                    {m.year}
                  </div>
                  <h3 className="mt-1 text-xl">{localize(m.title, locale)}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">
                    {localize(m.text, locale)}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      {/* Partners strip */}
      <Section tone="canvas" className="py-12 md:py-14">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.18em] text-faint">
            {t("partners")}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {partners.map((p) => (
              <span
                key={p}
                className="font-display text-2xl md:text-3xl text-ink/25"
              >
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Values */}
      <Section tone="surface">
        <h2 className="text-center font-display text-3xl md:text-4xl">
          {t("values.title")}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.key} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-line bg-canvas p-7">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
                  <v.Icon className="size-[1.375rem]" />
                </span>
                <h3 className="mt-5 text-lg">{t(`values.${v.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`values.${v.key}.desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Meet the experts */}
      <Section tone="canvas">
        <SectionHeading
          align="start"
          eyebrow={t("team.eyebrow")}
          title={t("team.title")}
          subtitle={t("team.subtitle")}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={(i % 4) * 0.08}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(min-width:1024px) 20rem, 45vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg leading-tight">{m.name}</h3>
                    <p className="mt-0.5 text-sm text-terracotta">
                      {localize(m.role, locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {siteConfig.social.instagram && (
                      <a
                        href={siteConfig.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on Instagram`}
                        className="inline-flex size-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold-deep"
                      >
                        <InstagramIcon className="size-4" />
                      </a>
                    )}
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      aria-label={`Email ${m.name}`}
                      className="inline-flex size-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold-deep"
                    >
                      <Mail className="size-4" />
                    </a>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

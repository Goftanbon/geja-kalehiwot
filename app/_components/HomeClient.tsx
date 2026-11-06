"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Book,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Coffee,
  HandHeart,
  LogOut,
  MapPin,
  Menu,
  Newspaper,
  ShoppingBag,
  Shirt,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { T, type Lang } from "@/lib/translations";
import { useContructUrl } from "@/hooks/use-construct-url";
import type { PublishedHomeSlide } from "@/app/data/user/home-slides";
import { HeroCarouselSkeleton } from "./HeroCarouselSkeleton";

type HomeClientProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
  slides?: PublishedHomeSlide[] | null;
};

const SLIDE_GRADIENTS: Record<string, string> = {
  BLUE_DARK: "from-[#172b4d] via-[#1555bf] to-black",
  BLUE: "from-[#1555bf] via-[#4f83d1] to-[#172b4d]",
  BLUE_GOLD: "from-[#172b4d] via-[#1555bf] to-[#d6a84b]",
};

/* ================================================================== */
/* STATIC DATA (no text here, only links, images, icons, colors)        */
/* Entries line up by index with the arrays in the dictionaries above.  */
/* ================================================================== */

const NAV_HREFS = ["#events", "#news", "#departments", "#shop", "#donate"];

// `image` must start with "/" (files live in /public). `position` picks the
// part of the photo that stays visible when it gets cropped.
const SLIDES = [
  {
    image: "/hero3.jpg",
    position: "center",
    gradient: "from-[#172b4d] via-[#1555bf] to-black",
    primaryHref: "#connect",
    secondaryHref: "#about",
  },
  {
    image: "/hero4.jpg",
    position: "center",
    gradient: "from-[#1555bf] via-[#172b4d] to-black",
    primaryHref: "#events",
    secondaryHref: "#news",
  },
  {
    image: "/Hero5.jpg",
    position: "center",
    gradient: "from-[#172b4d] via-[#1555bf] to-black",
    primaryHref: "https://www.youtube.com/@YOUR_CHANNEL",
    secondaryHref: "https://www.youtube.com/@YOUR_CHANNEL",
  },
];

const EXPERIENCES = [
  { icon: CalendarDays, href: "#events" },
  { icon: Newspaper, href: "#news" },
  { icon: Users, href: "#departments" },
  { icon: ShoppingBag, href: "#shop" },
];

const EVENT_GRADIENTS = [
  "from-[#1555bf] to-[#172b4d]",
  "from-[#172b4d] to-black",
  "from-[#4f83d1] to-[#172b4d]",
  "from-[#d6a84b] to-[#172b4d]",
];

const DEPT_STYLES = [
  { bg: "bg-[#1555bf]", text: "text-white", wide: false },
  { bg: "bg-[#172b4d]", text: "text-white", wide: false },
  { bg: "bg-[#4f83d1]", text: "text-white", wide: false },
  { bg: "bg-[#d6a84b]", text: "text-[#172b4d]", wide: false },
  { bg: "bg-neutral-800", text: "text-white", wide: true },
];

const PRODUCT_META = [
  { price: 650, icon: BookOpen },
  { price: 350, icon: Book },
  { price: 450, icon: Shirt },
  { price: 250, icon: Coffee },
];

const DONATION_AMOUNTS = [100, 500, 1000, 5000];

/* ------------------------------ pieces ------------------------------ */

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function PillLink({
  href,
  children,
  onDark = true,
}: {
  href: string;
  children: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center rounded-lg px-4 text-sm font-semibold transition",
        onDark
          ? "bg-white/20 text-inherit hover:bg-white/30"
          : "bg-foreground/10 hover:bg-foreground/20",
      )}
    >
      {children}
    </Link>
  );
}

// opens external links (YouTube, etc.) in a new tab
const external = (href: string) =>
  href.startsWith("http")
    ? ({ target: "_blank", rel: "noreferrer" } as const)
    : {};

/* ---------------------------- component ---------------------------- */

export default function HomeClient({ user, slides }: HomeClientProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // language
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  // Process DB slides or fallback to null (which uses static SLIDES & t.slides)
  const activeSlides = useMemo(() => {
    if (!slides || slides.length === 0) return null;

    return slides.map((s) => {
      // If image doesn't exist on db, fallback to /hero3.jpg
      const rawImage = s.image?.trim() || null;
      const imageUrl = rawImage ? useContructUrl(rawImage) : "/hero3.jpg";

      // Secondary button condition:
      // Must have secondaryHref AND both English and Amharic labels. If either is missing, do not show secondary button.
      const secEn = s.secondaryLabelEn?.trim();
      const secAm = s.secondaryLabelAm?.trim();
      const secHref = s.secondaryHref?.trim();
      const showSecondary = Boolean(secHref && secEn && secAm);

      return {
        id: s.id,
        image: imageUrl,
        gradient:
          SLIDE_GRADIENTS[s.gradient] ||
          "from-[#172b4d] via-[#1555bf] to-black",
        mediaType: s.mediaType,
        video: s.video ? useContructUrl(s.video) : null,
        primaryHref: s.primaryHref,
        secondaryHref: secHref || "",
        showSecondary,
        en: {
          title: s.titleEn,
          subtitle: s.subtitleEn,
          primary: s.primaryLabelEn,
          secondary: secEn || "",
        },
        am: {
          title: s.titleAm,
          subtitle: s.subtitleAm,
          primary: s.primaryLabelAm,
          secondary: secAm || "",
        },
      };
    });
  }, [slides]);

  const totalSlides = activeSlides ? activeSlides.length : SLIDES.length;

  // hero carousel
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const currentActive = active >= totalSlides ? 0 : active;

  // Track mount / data loading to prevent flashing the fallback carousel on first load
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoading = !mounted || slides === undefined;

  // events carousel
  const scroller = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState(0);

  // donation amount
  const [amount, setAmount] = useState(500);

  // restore the saved language after mount (avoids a hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "am" || saved === "en") setLang(saved);
  }, []);

  // put the language on <html> so menus and dialogs (rendered in portals)
  // also pick up the Amharic font rule
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const switchLang = () => {
    const next: Lang = lang === "en" ? "am" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  useEffect(() => {
    if (paused || totalSlides <= 1) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % totalSlides),
      15000,
    );
    return () => clearInterval(id);
  }, [paused, totalSlides]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // router.replace("/login");
            toast.success(t.ui.signedOut);
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || t.ui.logoutFailed);
          },
        },
      });
    } finally {
      setLoggingOut(false);
    }
  };

  const scrollCards = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const onScrollCards = () => {
    const el = scroller.current;
    if (!el) return;
    setDot(Math.round(el.scrollLeft / (el.scrollWidth / t.events.length)));
  };

  const currentSlideData = activeSlides ? activeSlides[currentActive] : null;
  const staticSlide = SLIDES[currentActive] || SLIDES[0];
  const staticText = t.slides[currentActive] || t.slides[0];

  const slideImage = currentSlideData ? currentSlideData.image : staticSlide.image;
  const slideGradient = currentSlideData ? currentSlideData.gradient : staticSlide.gradient;
  const slidePrimaryHref = currentSlideData ? currentSlideData.primaryHref : staticSlide.primaryHref;
  const slideSecondaryHref = currentSlideData ? currentSlideData.secondaryHref : staticSlide.secondaryHref;

  const slideTitle = currentSlideData ? currentSlideData[lang].title : staticText.title;
  const slideSubtitle = currentSlideData ? currentSlideData[lang].subtitle : staticText.subtitle;
  const slidePrimaryLabel = currentSlideData ? currentSlideData[lang].primary : staticText.primary;
  const slideSecondaryLabel = currentSlideData ? currentSlideData[lang].secondary : staticText.secondary;

  const showSecondaryBtn = currentSlideData
    ? currentSlideData.showSecondary
    : Boolean(staticSlide.secondaryHref && staticText.secondary);

  const navLinks = t.nav.map((label, i) => ({ label, href: NAV_HREFS[i] }));

  return (
    <div lang={lang} className="min-h-screen bg-background text-foreground">
      {/* ============================ Header ============================ */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-3 px-3 sm:h-20 sm:gap-4 sm:px-8">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t.ui.openMenu}
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>{t.ui.menu}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {[{ label: t.ui.home, href: "/" }, ...navLinks].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-brand-foreground">
              <img
                src="/logo.jpg"
                alt={t.brand}
                className="size-full object-cover"
              />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-lg font-semibold tracking-tight">
                {t.brand}
              </span>
              <span className="mt-0.5 block text-[9px] tracking-[0.4em] text-muted-foreground">
                {t.brandSub}
              </span>
            </span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <nav className="hidden items-center lg:flex">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <Button
              variant="ghost"
              size="sm"
              onClick={switchLang}
              aria-label={t.ui.switchLang}
              className="font-semibold"
            >
              {t.ui.langButton}
            </Button>

            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      aria-label={t.ui.account}
                      className="ml-1 flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  }
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={`${user.name}'s profile`}
                      referrerPolicy="no-referrer"
                      className="size-8 object-cover"
                    />
                  ) : (
                    <UserRound className="size-4" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p className="text-sm font-semibold">
                        {user.name || t.ui.there}
                      </p>
                      <p className="text-xs font-normal text-muted-foreground">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <LogOut className="mr-2 size-4" />
                    {loggingOut ? t.ui.loggingOut : t.ui.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants(), "ml-1 rounded-full px-5")}
              >
                {t.ui.login}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* ============================ Hero ============================ */}
        {isLoading ? (
          <HeroCarouselSkeleton />
        ) : (
          <section
            className="mx-auto max-w-[1700px] sm:px-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* hero always has a dark overlay, so its text stays white in both themes */}
            <div className="relative aspect-[4/5] max-h-[85vh] w-full overflow-hidden bg-neutral-900 text-white sm:aspect-[16/9]">
              {currentSlideData?.mediaType === "VIDEO" && currentSlideData.video ? (
                <video
                  key={currentActive}
                  src={currentSlideData.video}
                  poster={slideImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 size-full object-cover animate-in fade-in duration-700"
                />
              ) : (
                <div
                  key={currentActive}
                  className={cn(
                    "absolute inset-0 animate-in fade-in duration-700",
                    !slideImage && `bg-gradient-to-br ${slideGradient}`,
                  )}
                  style={
                    slideImage
                      ? {
                          backgroundImage: `url(${slideImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {currentActive > 0 && (
                <button
                  aria-label={t.ui.prevSlide}
                  onClick={() => setActive((i) => i - 1)}
                  className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 transition hover:bg-black/70"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {currentActive < totalSlides - 1 && (
                <button
                  aria-label={t.ui.nextSlide}
                  onClick={() => setActive((i) => i + 1)}
                  className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 transition hover:bg-black/70"
                >
                  <ChevronRight className="size-5" />
                </button>
              )}

              <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-5xl flex-col gap-5 p-6 pb-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {slideTitle}
                  </h1>
                  <p className="mt-1 text-sm text-white/90">
                    {slideSubtitle}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {slidePrimaryHref && slidePrimaryLabel && (
                    <Link
                      href={slidePrimaryHref}
                      {...external(slidePrimaryHref)}
                      className="inline-flex h-11 items-center rounded-lg bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      {slidePrimaryLabel}
                    </Link>
                  )}
                  {showSecondaryBtn && (
                    <Link
                      href={slideSecondaryHref}
                      {...external(slideSecondaryHref)}
                      className="inline-flex h-11 items-center rounded-lg bg-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/30"
                    >
                      {slideSecondaryLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {totalSlides > 1 && (
              <div className="mt-5 flex justify-center gap-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    aria-label={t.ui.goToSlide(i + 1)}
                    onClick={() => setActive(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === currentActive ? "w-4 bg-foreground" : "w-2 bg-foreground/30",
                    )}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ===================== Find your place ===================== */}
        <section id="connect" className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
          <SectionHeading title={t.find.title} subtitle={t.find.subtitle} />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
            {EXPERIENCES.map(({ icon: Icon, href }, i) => {
              const x = t.experiences[i];
              return (
                <div
                  key={href}
                  className="flex min-h-[280px] flex-col justify-between p-6"
                >
                  <div>
                    <Icon className="size-6 text-brand" />
                    <h3 className="mt-6 text-lg font-semibold">{x.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {x.text}
                    </p>
                  </div>
                  <Link
                    href={href}
                    className="mt-8 flex items-center justify-between text-sm font-semibold hover:text-brand"
                  >
                    {x.cta}
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================== Events ========================== */}
        <section id="events" className="bg-muted/40 py-20">
          <SectionHeading
            title={t.eventsSection.title}
            subtitle={t.eventsSection.subtitle}
          />

          <div className="relative mx-auto mt-12 max-w-[1700px]">
            <div
              ref={scroller}
              onScroll={onScrollCards}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
            >
              {t.events.map((e, i) => (
                <article
                  key={i}
                  className="w-[88%] shrink-0 snap-center sm:w-[55%] lg:w-[42%]"
                >
                  <div
                    className={cn(
                      "flex aspect-[16/9] items-end rounded-xl bg-gradient-to-br p-6 text-white",
                      EVENT_GRADIENTS[i],
                    )}
                  >
                    <span className="text-2xl font-extrabold tracking-tight uppercase">
                      {e.title}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold">{e.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {e.date}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {e.place}
                  </p>
                </article>
              ))}
            </div>

            <button
              aria-label={t.ui.prevEvents}
              onClick={() => scrollCards(-1)}
              className="absolute top-[35%] left-6 hidden size-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 sm:flex"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              aria-label={t.ui.nextEvents}
              onClick={() => scrollCards(1)}
              className="absolute top-[35%] right-6 hidden size-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 sm:flex"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {t.events.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === dot ? "w-4 bg-foreground" : "w-2 bg-foreground/30",
                )}
              />
            ))}
          </div>
        </section>

        {/* =========================== News =========================== */}
        <section id="news" className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
          <SectionHeading
            title={t.newsSection.title}
            subtitle={t.newsSection.subtitle}
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.news.map((n, i) => (
              <article
                key={i}
                className="flex flex-col rounded-xl border border-border bg-card p-6 text-card-foreground"
              >
                <p className="text-xs font-medium tracking-wide text-brand uppercase">
                  {n.date}
                </p>
                <h3 className="mt-3 text-lg font-semibold">{n.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {n.excerpt}
                </p>
                <Link
                  href="#news"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold hover:text-brand"
                >
                  {t.ui.readMore} <ChevronRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ======================== Departments ======================== */}
        <section id="departments" className="bg-muted/40 px-4 py-20 sm:px-8">
          <SectionHeading
            title={t.deptSection.title}
            subtitle={t.deptSection.subtitle}
          />

          <div className="mx-auto mt-12 grid max-w-7xl gap-4 sm:grid-cols-2">
            {t.departments.map((d, i) => {
              const s = DEPT_STYLES[i];
              return (
                <div
                  key={i}
                  className={cn(
                    "flex min-h-[220px] flex-col justify-between rounded-xl p-6",
                    s.bg,
                    s.text,
                    s.wide && "sm:col-span-2",
                  )}
                >
                  <div>
                    <p className="text-sm opacity-80">{d.name}</p>
                    <h3 className="mt-1 max-w-xl text-xl font-bold">
                      {d.title}
                    </h3>
                  </div>
                  <div>
                    <PillLink href="#departments">{t.ui.learnMore}</PillLink>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================== Shop ========================== */}
        {/* <section id="shop" className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
          <SectionHeading
            title={t.shopSection.title}
            subtitle={t.shopSection.subtitle}
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.products.map((p, i) => {
              const { price, icon: Icon } = PRODUCT_META[i];
              return (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground"
                >
                  <div className="flex aspect-square items-center justify-center bg-secondary">
                    <Icon className="size-14 text-brand" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs text-muted-foreground">
                      {p.category}
                    </p>
                    <h3 className="mt-1 font-semibold">{p.name}</h3>
                    <p className="mt-1 text-sm font-medium text-brand">
                      {price} {t.ui.currency}
                    </p>
                    <Button
                      className="mt-4 w-full"
                      onClick={() => toast.info(t.ui.orderSoon)}
                    >
                      <ShoppingBag className="mr-2 size-4" />
                      {t.ui.order}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section> */}

        {/* ========================= Donate ========================= */}
        <section id="donate" className="px-4 pb-24 sm:px-8">
          <div className="mx-auto max-w-5xl rounded-2xl bg-primary p-8 text-center text-primary-foreground sm:p-12">
            <HandHeart className="mx-auto size-10" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              {t.donate.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm opacity-90">
              {t.donate.text}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {DONATION_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={cn(
                    "h-11 rounded-lg px-5 text-sm font-semibold transition",
                    amount === a
                      ? "bg-primary-foreground text-primary"
                      : "bg-primary-foreground/15 hover:bg-primary-foreground/25",
                  )}
                >
                  {a} {t.ui.currency}
                </button>
              ))}
            </div>

            <button
              onClick={() => toast.info(t.ui.donateSoon(amount))}
              className="mt-6 inline-flex h-12 items-center rounded-lg bg-primary-foreground px-10 text-sm font-bold text-primary transition hover:opacity-90"
            >
              {t.ui.donateAmount(amount)}
            </button>
          </div>
        </section>
      </main>

      <footer
        id="about"
        className="border-t border-border px-4 py-10 text-center text-sm text-muted-foreground"
      >
        {t.ui.footer(new Date().getFullYear())}
      </footer>
    </div>
  );
}

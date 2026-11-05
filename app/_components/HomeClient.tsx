"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Church,
  Coffee,
  HandHeart,
  LogOut,
  MapPin,
  Menu,
  Newspaper,
  Search,
  ShoppingBag,
  Shirt,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type HomeClientProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
};

/* ------------------------------------------------------------------ */
/* Sample data. Each array mirrors a table in your schema (event, news, */
/* department, product) so it's easy to swap for real Prisma data later. */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Events", href: "#events" },
  { label: "News", href: "#news" },
  { label: "Departments", href: "#departments" },
  { label: "Shop", href: "#shop" },
  { label: "Donate", href: "#donate" },
];

// Set `image` to a file in /public (e.g. "/hero-1.jpg") to use a real photo.
const SLIDES = [
  {
    title: "Welcome to Geja Kale Hiwot",
    subtitle: "A community growing together in faith.",
    primary: { label: "Get connected", href: "#connect" },
    secondary: { label: "Learn more", href: "#about" },
    image: "/hero3.jpg",
    gradient: "from-[#172b4d] via-[#1555bf] to-black",
  },
  {
    title: "Join us at our next event",
    subtitle: "Worship, conferences, and community gatherings.",
    primary: { label: "See events", href: "#events" },
    secondary: { label: "Latest news", href: "#news" },
    image: "hero4.jpg",
    gradient: "from-[#1555bf] via-[#172b4d] to-black",
  },
  {
    title: "Listen to Our Music",
    subtitle:
      "Experience uplifting worship and praise through the music of Geja Kale Hiwot.",
    primary: {
      label: "Listen on YouTube",
      href: "https://www.youtube.com/@YOUR_CHANNEL",
    },
    secondary: {
      label: "Listen on Spotify",
      href: "https://www.youtube.com/@YOUR_CHANNEL",
    },
    image: "Hero5.jpg",
    gradient: "from-[#172b4d] via-[#1555bf] to-black",
  },
];

const EXPERIENCES = [
  {
    icon: CalendarDays,
    title: "Events",
    text: "Find worship services, conferences, and gatherings happening near you.",
    cta: "Browse events",
    href: "#events",
  },
  {
    icon: Newspaper,
    title: "News",
    text: "Stay up to date with announcements and stories from our church family.",
    cta: "Read the news",
    href: "#news",
  },
  {
    icon: Users,
    title: "Departments",
    text: "Discover a department where you can grow, connect, and use your gifts.",
    cta: "Explore departments",
    href: "#departments",
  },
  {
    icon: ShoppingBag,
    title: "Shop",
    text: "Books, apparel, and more. Every purchase supports our ministry.",
    cta: "Visit the shop",
    href: "#shop",
  },
];

const EVENTS = [
  {
    title: "Sunday Worship Service",
    date: "Every Sunday, 8:00 AM",
    place: "Main Sanctuary",
    gradient: "from-[#1555bf] to-[#172b4d]",
  },
  {
    title: "Youth Conference",
    date: "Nov 21, 2026",
    place: "Main Hall",
    gradient: "from-[#172b4d] to-black",
  },
  {
    title: "Community Outreach Day",
    date: "Dec 5, 2026",
    place: "Addis Ababa",
    gradient: "from-[#4f83d1] to-[#172b4d]",
  },
  {
    title: "Genna Celebration",
    date: "Jan 7, 2027",
    place: "Main Sanctuary",
    gradient: "from-[#d6a84b] to-[#172b4d]",
  },
];

const NEWS = [
  {
    title: "New season of Sunday school begins",
    date: "Nov 3, 2026",
    excerpt:
      "Registration is now open for children and teens. Families can sign up after any service.",
  },
  {
    title: "Choir announces annual concert",
    date: "Oct 28, 2026",
    excerpt:
      "An evening of worship music with guest ministers and the full choir.",
  },
  {
    title: "Outreach team reaches 500 families",
    date: "Oct 15, 2026",
    excerpt:
      "Thanks to your generosity, food and supplies were delivered across the city this month.",
  },
];

const DEPARTMENTS = [
  {
    name: "Worship & Choir",
    title: "Inspiring an atmosphere of worship to God.",
    bg: "bg-[#1555bf]",
    text: "text-white",
    wide: false,
  },
  {
    name: "Children's Ministry",
    title: "Partnering with parents to grow kids' faith.",
    bg: "bg-[#172b4d]",
    text: "text-white",
    wide: false,
  },
  {
    name: "Youth Ministry",
    title: "Developing youth who influence culture.",
    bg: "bg-[#4f83d1]",
    text: "text-white",
    wide: false,
  },
  {
    name: "Outreach",
    title: "Making an impact, locally and globally.",
    bg: "bg-[#d6a84b]",
    text: "text-[#172b4d]",
    wide: false,
  },
  {
    name: "Prayer & Care",
    title: "Standing with people through every season of life.",
    bg: "bg-neutral-800",
    text: "text-white",
    wide: true,
  },
];

const PRODUCTS = [
  {
    name: "Amharic Study Bible",
    category: "Books",
    price: 650,
    icon: BookOpen,
  },
  { name: "Worship Songbook", category: "Books", price: 350, icon: Book },
  {
    name: "Geja Kale Hiwot T-Shirt",
    category: "Apparel",
    price: 450,
    icon: Shirt,
  },
  { name: "Church Mug", category: "Gifts", price: 250, icon: Coffee },
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

/* ---------------------------- component ---------------------------- */

export default function HomeClient({ user }: HomeClientProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // hero carousel
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // events carousel
  const scroller = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState(0);

  // donation amount
  const [amount, setAmount] = useState(500);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      15000,
    );
    return () => clearInterval(id);
  }, [paused]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // router.replace("/login");
            toast.success("You've signned out");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to log out");
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
    setDot(Math.round(el.scrollLeft / (el.scrollWidth / EVENTS.length)));
  };

  const slide = SLIDES[active];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ============================ Header ============================ */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-3 px-3 sm:h-20 sm:gap-4 sm:px-8">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {[{ label: "Home", href: "/" }, ...NAV_LINKS].map((l) => (
                  <Link
                    key={l.label}
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
            <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <div className="size-full overflow-hidden rounded-full">
                <img
                  src="/logo.jpg"
                  alt="Geja Kale Hiwot"
                  className="size-full rounded-full object-cover"
                />
              </div>
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-lg font-semibold tracking-tight">
                Geja Kale Hiwot
              </span>
              <span className="block text-[9px] tracking-[0.4em] text-muted-foreground">
                CHURCH
              </span>
            </span>
          </Link>

          <div className="relative mx-auto w-full max-w-[410px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search" className="h-10 rounded-full pl-10" />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <nav className="hidden items-center lg:flex">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      aria-label="Account menu"
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
                        {user.name || "there"}
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
                    {loggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants(), "ml-1 rounded-full px-5")}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* ============================ Hero ============================ */}
        <section
          className="mx-auto max-w-[1700px] sm:px-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* hero always has a dark overlay, so its text stays white in both themes */}
          {/* <div className="relative h-[60vh] min-h-[420px] overflow-hidden bg-neutral-900 text-white sm:h-[70vh]"> */}
          <div className="relative aspect-[4/5] max-h-[85vh] w-full overflow-hidden bg-neutral-900 text-white sm:aspect-[16/9]">
            <div
              key={active}
              className={cn(
                "absolute inset-0 animate-in fade-in duration-700",
                !slide.image && `bg-gradient-to-br ${slide.gradient}`,
              )}
              style={
                slide.image
                  ? {
                      backgroundImage: `url(${slide.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {active > 0 && (
              <button
                aria-label="Previous slide"
                onClick={() => setActive((i) => i - 1)}
                className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 transition hover:bg-black/70"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {active < SLIDES.length - 1 && (
              <button
                aria-label="Next slide"
                onClick={() => setActive((i) => i + 1)}
                className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 transition hover:bg-black/70"
              >
                <ChevronRight className="size-5" />
              </button>
            )}

            <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-5xl flex-col gap-5 p-6 pb-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {slide.title}
                </h1>
                <p className="mt-1 text-sm text-white/90">{slide.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={slide.primary.href}
                  className="inline-flex h-11 items-center rounded-lg bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  {slide.primary.label}
                </Link>
                <Link
                  href={slide.secondary.href}
                  className="inline-flex h-11 items-center rounded-lg bg-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/30"
                >
                  {slide.secondary.label}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === active ? "w-4 bg-foreground" : "w-2 bg-foreground/30",
                )}
              />
            ))}
          </div>
        </section>

        {/* ===================== Find your place ===================== */}
        <section id="connect" className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
          <SectionHeading
            title="Find your place in our community"
            subtitle="Whether you're new or have been with us for years, there's a way for you to belong and grow."
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
            {EXPERIENCES.map(({ icon: Icon, title, text, cta, href }) => (
              <div
                key={title}
                className="flex min-h-[280px] flex-col justify-between p-6"
              >
                <div>
                  <Icon className="size-6 text-brand" />
                  <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
                <Link
                  href={href}
                  className="mt-8 flex items-center justify-between text-sm font-semibold hover:text-brand"
                >
                  {cta}
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ========================== Events ========================== */}
        <section id="events" className="bg-muted/40 py-20">
          <SectionHeading
            title="Upcoming events"
            subtitle="Join us for worship, fellowship, and special gatherings throughout the year."
          />

          <div className="relative mx-auto mt-12 max-w-[1700px]">
            <div
              ref={scroller}
              onScroll={onScrollCards}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
            >
              {EVENTS.map((e) => (
                <article
                  key={e.title}
                  className="w-[88%] shrink-0 snap-center sm:w-[55%] lg:w-[42%]"
                >
                  <div
                    className={cn(
                      "flex aspect-[16/9] items-end rounded-xl bg-gradient-to-br p-6 text-white",
                      e.gradient,
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
              aria-label="Previous events"
              onClick={() => scrollCards(-1)}
              className="absolute top-[35%] left-6 hidden size-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 sm:flex"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              aria-label="Next events"
              onClick={() => scrollCards(1)}
              className="absolute top-[35%] right-6 hidden size-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 sm:flex"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {EVENTS.map((_, i) => (
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
            title="Latest news"
            subtitle="Announcements and stories from our church family."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {NEWS.map((n) => (
              <article
                key={n.title}
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
                  Read more <ChevronRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ======================== Departments ======================== */}
        <section id="departments" className="bg-muted/40 px-4 py-20 sm:px-8">
          <SectionHeading
            title="Our departments"
            subtitle="Find a team where you and your family can grow in faith and serve together."
          />

          <div className="mx-auto mt-12 grid max-w-7xl gap-4 sm:grid-cols-2">
            {DEPARTMENTS.map((d) => (
              <div
                key={d.name}
                className={cn(
                  "flex min-h-[220px] flex-col justify-between rounded-xl p-6",
                  d.bg,
                  d.text,
                  d.wide && "sm:col-span-2",
                )}
              >
                <div>
                  <p className="text-sm opacity-80">{d.name}</p>
                  <h3 className="mt-1 max-w-xl text-xl font-bold">{d.title}</h3>
                </div>
                <div>
                  <PillLink href="#departments">Learn more</PillLink>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================== Shop ========================== */}
        {/* <section id="shop" className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
          <SectionHeading
            title="From our shop"
            subtitle="Books, apparel, and gifts. Every purchase supports our ministry."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map(({ name, category, price, icon: Icon }) => (
              <div
                key={name}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground"
              >
                <div className="flex aspect-square items-center justify-center bg-secondary">
                  <Icon className="size-14 text-brand" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs text-muted-foreground">{category}</p>
                  <h3 className="mt-1 font-semibold">{name}</h3>
                  <p className="mt-1 text-sm font-medium text-brand">
                    {price} ETB
                  </p>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => toast.info("Ordering isn't connected yet.")}
                  >
                    <ShoppingBag className="mr-2 size-4" />
                    Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* ========================= Donate ========================= */}
        <section id="donate" className="px-4 pb-24 sm:px-8">
          <div className="mx-auto max-w-5xl rounded-2xl bg-primary p-8 text-center text-primary-foreground sm:p-12">
            <HandHeart className="mx-auto size-10" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Support the mission
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm opacity-90">
              Your generosity helps us serve our community, support families in
              need, and spread the gospel.
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
                  {a} ETB
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                toast.info(`Donations aren't connected yet (${amount} ETB).`)
              }
              className="mt-6 inline-flex h-12 items-center rounded-lg bg-primary-foreground px-10 text-sm font-bold text-primary transition hover:opacity-90"
            >
              Donate {amount} ETB
            </button>
          </div>
        </section>
      </main>

      <footer
        id="about"
        className="border-t border-border px-4 py-10 text-center text-sm text-muted-foreground"
      >
        © {new Date().getFullYear()} Geja Kale Hiwot Church. All rights
        reserved.
      </footer>
    </div>
  );
}

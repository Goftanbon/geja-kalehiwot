"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Building2,
  ChevronLeft,
  ChevronRight,
  Church,
  Globe,
  House,
  LogOut,
  Menu,
  MonitorPlay,
  Search,
  UserRound,
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

/* ------------------------------ data ------------------------------ */

const NAV_LINKS = [
  { label: "Give", href: "#give" },
  { label: "Groups", href: "#groups" },
  { label: "Serve", href: "#serve" },
  { label: "Events", href: "#events" },
  { label: "About", href: "#about" },
];

// Set `image` to a file in /public (e.g. "/hero-1.jpg") to use a real photo.
const SLIDES = [
  {
    title: "Welcome to Elevation Church",
    subtitle: "See what God can do through you.",
    primary: { label: "Get connected", href: "#connect" },
    secondary: { label: "Learn more", href: "#about" },
    image: null as string | null,
    gradient: "from-slate-700 via-stone-800 to-black",
  },
  {
    title: "Pastor Steven Furtick",
    subtitle: "Watch the latest sermon",
    primary: { label: "Watch sermon", href: "#watch" },
    secondary: { label: "Watch full experience", href: "#watch" },
    image: null as string | null,
    gradient: "from-blue-900 via-neutral-900 to-black",
  },
];

const EXPERIENCES = [
  {
    icon: Building2,
    title: "Physical Campus",
    text: "Worship with us in person at one of our physical campuses.",
    cta: "Find a location",
    href: "#visit",
  },
  {
    icon: MonitorPlay,
    title: "Live Streams",
    text: "Our online community streams church from wherever they are.",
    cta: "Find a time",
    href: "#watch",
  },
  {
    icon: House,
    title: "Watch Party",
    text: "Watch Parties are groups that stream the worship experience together.",
    cta: "Find a watch party",
    href: "#groups",
  },
  {
    icon: Globe,
    title: "Pop-Up",
    text: "A Pop-Up is where we bring church to different cities across the nation.",
    cta: "Find a pop-up",
    href: "#events",
  },
];

const CONNECT_CARDS = [
  {
    title: "Elevation Rhythm",
    meta: "Concert series, tickets",
    gradient: "from-blue-600 to-indigo-900",
  },
  {
    title: "Chapel Is November 5",
    meta: "Young adults, RSVP",
    gradient: "from-neutral-700 to-black",
  },
  {
    title: "Take Time To Pray",
    meta: "Start our new devotional",
    gradient: "from-orange-600 to-red-900",
  },
  {
    title: "Community Outreach",
    meta: "Serve your city, sign up",
    gradient: "from-green-600 to-emerald-900",
  },
];

const FAMILY_CARDS = [
  {
    label: "eGroup Ministry",
    title: "Connecting people. Activating faith.",
    bg: "bg-blue-900",
    wide: false,
  },
  {
    label: "Outreach Ministry",
    title: "Making an impact – locally and globally.",
    bg: "bg-green-600",
    wide: false,
  },
  {
    label: "Children's Ministry",
    title: "Partnering with parents to develop kids' faith.",
    bg: "bg-cyan-500",
    wide: false,
  },
  {
    label: "Youth Ministry",
    title: "Developing youth who influence culture.",
    bg: "bg-neutral-900",
    wide: false,
  },
  {
    label: "Young Adult Ministry",
    title: "Building community. Deepening faith.",
    bg: "bg-orange-600",
    wide: false,
  },
  {
    label: "Elevation College",
    title: "Where calling meets college.",
    bg: "bg-neutral-500",
    wide: false,
  },
  {
    label: "Worship Ministry",
    title: "Inspiring your faith and creating an atmosphere of worship to God.",
    bg: "bg-neutral-950 border border-white/10",
    wide: true,
  },
];

const INVOLVED = [
  {
    title: "Volunteer",
    text: "Participate in the mission to advance the gospel by serving on a volunteer team.",
  },
  {
    title: "Lead",
    text: "Lead an eGroup, host a Watch Party or become a student leader.",
  },
  {
    title: "Opportunities",
    text: "Explore opportunities to use your gifts in a ministry setting.",
  },
];

/* --------------------------- small pieces --------------------------- */

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
      {subtitle && <p className="mt-4 text-white/70">{subtitle}</p>}
    </div>
  );
}

function PillLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center rounded-lg bg-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/25"
    >
      {children}
    </Link>
  );
}

/* ----------------------------- component ----------------------------- */

export default function HomeClient({ user }: HomeClientProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // hero carousel
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // "discover" carousel
  const scroller = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      7000,
    );
    return () => clearInterval(id);
  }, [paused]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/login");
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
    setDot(Math.round(el.scrollLeft / (el.scrollWidth / CONNECT_CARDS.length)));
  };

  const slide = SLIDES[active];

  return (
    <div className="dark min-h-screen bg-black text-white">
      {/* ============================ Header ============================ */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-3 px-3 sm:h-20 sm:gap-4 sm:px-8">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="text-white hover:bg-white/10 hover:text-white"
                />
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
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-orange-500">
              <Church className="size-5 text-white" />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-xl font-semibold tracking-tight">
                Elevation
              </span>
              <span className="block text-[9px] tracking-[0.4em] text-white/70">
                CHURCH
              </span>
            </span>
          </Link>

          <div className="relative mx-auto w-full max-w-[410px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/60" />
            <Input
              placeholder="Search"
              className="h-10 rounded-full border-white/40 bg-transparent pl-10 text-white placeholder:text-white/60"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <nav className="hidden items-center lg:flex">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      aria-label="Account menu"
                      className="ml-2 flex size-10 items-center justify-center overflow-hidden rounded-full bg-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    />
                  }
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={`${user.name}'s profile`}
                      referrerPolicy="no-referrer"
                      className="size-10 object-cover"
                    />
                  ) : (
                    <UserRound className="size-5" />
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
                className={cn(
                  buttonVariants(),
                  "ml-2 rounded-full bg-white px-5 text-black hover:bg-white/90",
                )}
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
          <div className="relative h-[60vh] min-h-[420px] overflow-hidden bg-neutral-900 sm:h-[70vh]">
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
                  i === active ? "w-4 bg-white" : "w-2 bg-white/40",
                )}
              />
            ))}
          </div>
        </section>

        {/* ================= Find the right experience ================= */}
        <section id="connect" className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
          <SectionHeading
            title="Find the right experience for you"
            subtitle="No matter where you are, online or in person, become a part of all God is doing."
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {EXPERIENCES.map(({ icon: Icon, title, text, cta, href }) => (
              <div
                key={title}
                className="flex min-h-[280px] flex-col justify-between p-6"
              >
                <div>
                  <Icon className="size-6 text-white/80" />
                  <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {text}
                  </p>
                </div>
                <Link
                  href={href}
                  className="mt-8 flex items-center justify-between text-sm font-semibold hover:text-white/80"
                >
                  {cta}
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ================= Discover more ways to connect ================= */}
        <section id="events" className="py-16">
          <SectionHeading
            title="Discover more ways to connect"
            subtitle="There are always new ways to participate in what God is doing through our church, including events, tours, worship music, and so much more."
          />

          <div className="relative mx-auto mt-12 max-w-[1700px]">
            <div
              ref={scroller}
              onScroll={onScrollCards}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
            >
              {CONNECT_CARDS.map((c) => (
                <article
                  key={c.title}
                  className="w-[88%] shrink-0 snap-center sm:w-[55%] lg:w-[42%]"
                >
                  <div
                    className={cn(
                      "flex aspect-[16/9] items-end rounded-xl bg-gradient-to-br p-6",
                      c.gradient,
                    )}
                  >
                    <span className="text-2xl font-extrabold tracking-tight uppercase opacity-90">
                      {c.title}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{c.meta}</p>
                </article>
              ))}
            </div>

            <button
              aria-label="Previous"
              onClick={() => scrollCards(-1)}
              className="absolute top-[35%] left-6 hidden size-11 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 sm:flex"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              aria-label="Next"
              onClick={() => scrollCards(1)}
              className="absolute top-[35%] right-6 hidden size-11 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 sm:flex"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {CONNECT_CARDS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === dot ? "w-4 bg-white" : "w-2 bg-white/40",
                )}
              />
            ))}
          </div>
        </section>

        {/* ================= A place for you and your family ================= */}
        <section id="groups" className="bg-neutral-950 px-4 py-20 sm:px-8">
          <SectionHeading
            title="A place for you and your family"
            subtitle="Join small groups, get involved in outreach, and discover ways for your whole family to grow in their faith."
          />

          <div className="mx-auto mt-12 grid max-w-7xl gap-4 sm:grid-cols-2">
            {FAMILY_CARDS.map((c) => (
              <div
                key={c.label}
                className={cn(
                  "flex min-h-[220px] flex-col justify-between rounded-xl p-6",
                  c.bg,
                  c.wide && "sm:col-span-2",
                )}
              >
                <div>
                  <p className="text-sm text-white/80">{c.label}</p>
                  <h3 className="mt-1 max-w-xl text-xl font-bold">{c.title}</h3>
                </div>
                <div>
                  <PillLink href="#about">Learn more</PillLink>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================= How to get involved ======================= */}
        <section id="serve" className="px-4 py-20 sm:px-8">
          <SectionHeading
            title="How to get involved"
            subtitle="See how God can use your gifts to make an eternal impact."
          />

          <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
            {INVOLVED.map((c) => (
              <div
                key={c.title}
                className="flex min-h-[260px] flex-col justify-end rounded-xl bg-neutral-800 p-6"
              >
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-white/70">{c.text}</p>
                <div className="mt-5">
                  <PillLink href="#about">Learn more</PillLink>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        id="about"
        className="border-t border-white/10 px-4 py-10 text-center text-sm text-white/60"
      >
        © {new Date().getFullYear()} Elevation Church clone. For learning
        purposes only.
      </footer>
    </div>
  );
}
